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

import { IPC_ERROR_LOG_EVENT_TYPES, IS_DEV } from '@/constants';
import { validateMockVersion } from '@/renderer/utils/validate-mock-version';

//TODO: @Rene: bitte im Rahmen von authcl-448 diese Function loeschen
export function getCallerInfo(err: any): string {
  const caller_line = err?.stack?.split('\n')[4];

  if (!caller_line) {
    return '';
  }

  if (isNaN(caller_line)) return caller_line;
  const index = caller_line.indexOf('at ');
  return caller_line.slice(index + 2, caller_line.length);
}

export const logger = {
  error: (...args: unknown[]) => {
        (IS_DEV || validateMockVersion()) && console.error(...args); // eslint-disable-line
    window?.api?.send(IPC_ERROR_LOG_EVENT_TYPES.ERROR, args);
  },
  debug: (...args: unknown[]) => {
        (IS_DEV || validateMockVersion()) && console.debug(...args); // eslint-disable-line
    window?.api?.send(IPC_ERROR_LOG_EVENT_TYPES.DEBUG, args);
  },
  warn: (...args: unknown[]) => {
        (IS_DEV || validateMockVersion()) && console.warn(...args); // eslint-disable-line
    window?.api?.send(IPC_ERROR_LOG_EVENT_TYPES.WARN, args);
  },
  info: (...args: unknown[]) => {
        (IS_DEV || validateMockVersion()) && console.info(...args); // eslint-disable-line
    window?.api?.send(IPC_ERROR_LOG_EVENT_TYPES.INFO, args);
  },
};
