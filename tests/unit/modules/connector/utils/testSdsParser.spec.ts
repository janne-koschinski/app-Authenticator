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

import sdsParser from '@/renderer/modules/connector/common/sds-parser';
import { printTestTitle, readResourceFile, TestCategory } from '../../../../TestInfo';
import { XML_TAG_NAMES } from '@/renderer/modules/connector/constants';

let endpoints = new Map();

/**
 *  nur noch endpointTls wird benötigt.
 */
xdescribe(TestCategory.positivTest, () => {
  printTestTitle(__filename);
  it(TestCategory.utilTest + ': Endpoint secunet-PTV4', async () => {
    const sdsSecunet = readResourceFile('connSds', 'secunet-PTV4.xml');
    handleSds(sdsSecunet);
    expect(endpoints.size).toEqual(20);
    expect(getEndpoint(XML_TAG_NAMES.TAG_CERTIFICATE_SERVICE)).toEqual(
      'https://10.11.217.160:443/ws/CertificateService',
    );
    expect(getEndpoint(XML_TAG_NAMES.TAG_EVENT_SERVICE)).toEqual('https://10.11.217.160:443/ws/EventService');
  });

  it(TestCategory.utilTest + ': Endpoint kops-PTV4', async () => {
    endpoints = new Map();
    const sdsKops = readResourceFile('connSds', 'kops-PTV4.xml');
    handleSds(sdsKops);
    expect(endpoints.size).toEqual(18);
    expect(getEndpoint(XML_TAG_NAMES.TAG_CERTIFICATE_SERVICE)).toEqual('http://172.25.0.4:80/certificateservice');
    expect(getEndpoint(XML_TAG_NAMES.TAG_EVENT_SERVICE)).toEqual('http://172.25.0.4:80/eventservice');
  });
});

function handleSds(sds: string) {
  endpoints = sdsParser(sds);
}

function getEndpoint(serviceName: string) {
  return endpoints.get(serviceName);
}
