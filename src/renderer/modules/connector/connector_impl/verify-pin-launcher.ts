/*
 * Copyright (c) 2023 gematik GmbH
 * 
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the Licence);
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 * 
 *     https://joinup.ec.europa.eu/software/page/eupl
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 * 
 */

import { XML_ERROR_TAG_NAMES, XML_TAG_NAMES } from '@/renderer/modules/connector/constants';
import ConnectorConfig from './connector-config';
import * as pinVerifier from './verify-pin';
import * as connectorSdsRequest from './sds-request';
import { logger } from '@/renderer/service/logger';
import cardHandleParser from '@/renderer/modules/connector/common/soap-response-xml-parser';
import { checkSoapError } from '@/renderer/modules/connector/common/utils';
import { UserfacingError } from '@/renderer/errors/errors';
import { ERROR_CODES } from '@/error-codes';
import { TCardData } from '@/renderer/modules/connector/type-definitions';

/**
 * @param endpoint
 * @param cardHandle
 * @param pinType
 * @returns {Promise<void>}
 */
export const verifyPin = async (endpoint: string, cardHandle: string, pinType: string): Promise<string> => {
  const endpointMapped = ConnectorConfig.mapEndpoint(endpoint);
  return await pinVerifier.runSoapRequest(ConnectorConfig.contextParameters, endpointMapped, cardHandle, pinType);
};

export const launch = async (terminals: Array<any>, cardData: TCardData): Promise<string> => {
  let cardServiceEndpoint, statusResult;
  try {
    cardServiceEndpoint = await connectorSdsRequest.getServiceEndpointTls(XML_TAG_NAMES.TAG_CARD_SERVICE);
    logger.debug(`Using card service endpoint ${cardServiceEndpoint} to send SDS requests to connector.`);
    checkRemotePIN(terminals, cardData);
    const statusVerifyResponse = await verifyPin(
      cardServiceEndpoint,
      cardData.cardHandle,
      ConnectorConfig.cardsParametersByType(cardData.cardType).pinType,
    );
    logger.debug(`verifyPinResp: ${statusVerifyResponse}`);
    statusResult = cardHandleParser(statusVerifyResponse, XML_TAG_NAMES.TAG_VERIFY_RESULT);
    if (statusResult !== 'OK') {
      checkSoapError(statusVerifyResponse);
      logger.warn(
        'VerifyPIN response warning :',
        cardHandleParser(statusVerifyResponse, XML_ERROR_TAG_NAMES.TAG_ERROR_MESSAGE),
      );
    }
    return statusVerifyResponse;
  } catch (err) {
    logger.error('Error getting VerifyPIN Status from connector', err.message);
    throw checkSoapError(err.response?.body) || err;
  }
};

export function checkRemotePIN(terminals: Array<any>, card: TCardData): void {
  logger.info('Check RemotePIN for CardData ', JSON.stringify(card));
  const terminalData = Array.from(terminals).filter((item: any) => item.CtId === card.ctId && item.WorkplaceIds === '');
  if (terminalData.length > 0) {
    logger.warn('Remote VerifyPIN is not supported', terminalData);
    throw new UserfacingError('Remote VerifyPIN is not supported', '', ERROR_CODES.AUTHCL_1104, {
      cardType: card.cardType,
      terminal: card.ctId,
    });
  }
}