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

import { GemIdpJwsOptions } from '@/renderer/modules/gem-idp/sign-feature/cidp-sign-options';
import { ECardTypes } from '@/renderer/modules/connector/ECardTypes';

const BASE64_HEADER_MOCK = 'eyJuand0IjoiS3VhUzl0VTdaNjc2T3oxdzB2MHZDSXBnZnQyMUs4ZWlRS0Rrd1BfSFhkRSJ9';
const BASE64_PAYLOAD_MOCK =
  'eyJhbGciOiJSUzI1NiIsIng1YyI6WyJNSUlFcHpDQ0E0K2dBd0lCQWdJRVhFb3U3VEFOQmdrcWhraUc5dzBCQVFzRkFEQ0JoekVqTUNFR0ExVUVBd3dhUXk1RlNFVllMa2hWVFVGT0xVTkJNU0JVUlZOVUxVOU9URmt4TlRBekJnTlZCQXNNTEdWSVpXRnNkR2hGZUhCbGNuUnpMVU5CSUdSbGNpQlVaV3hsYldGMGFXdHBibVp5WVhOMGNuVnJkSFZ5TVJ3d0dnWURWUVFLREJObFNHVmhiSFJvUlhod1pYSjBjeUJIYldKSU1Rc3dDUVlEVlFRR0V3SkVSVEFlRncweU1UQTVNamd4TVRBME5EbGFGdzAwT0RFeU16QXlNekF3TURCYU1HVXhHakFZQmdOVkJBTU1FVlJsYzNRZ1VISmhlR2x6SUZaaGJHbGtNUnd3R2dZRFZRUUZFeE14TFhOdFkySXRaRzlqZEc5eUxYWmhiR2xrTVJ3d0dnWURWUVFLREJObFNHVmhiSFJvUlhod1pYSjBjeUJIYldKSU1Rc3dDUVlEVlFRR0V3SkVSVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFLa0tZNEtxMlpXUkNabnkrOGxyNjcvK3RucnVBSnB4akRQRHpQSU5sN1lDNlh0THI0WC9uUFZoQW0vN0E0T2hJdzNaRDgwdW4yeEcxelQwc2svU2xvWU55N0U1Q0hyd2JYeVRRRnNncy9LWTZZdjZxdEdIaHpKZ3haZ0N4aDUxZEVxTkFCTlhqZXVmT1B5YmlmaHBmVHVPTEJQV09NWnNtNytaMFl2SGFxY1dTTUllK1orQjZ0YWhuVTNwbUlCUXRWbTJQQ1JRNHk3SjJJYUdKSldEbVNPdTM3NGdaWjNQRCtkV0RoQjZuaEk0OXY1dGtFSWFMSDIyeWFHdzFxV2duT3R2Q0JTY2trY0txOGFjVC8wL3AvQ2x1Ulo2Zi9LVDlidDJGSHRPZHZxM3BBS3BzS3FpUXZ0S1hGUjJYc2JscStReTVkVXZGeEFsOWZkTk83dUJ2d3NDQXdFQUFhT0NBVG93Z2dFMk1COEdBMVVkSXdRWU1CYUFGT1BaWGd1N0ZWVnBKSXUybHJ0dnpFSGRCM3BmTUIwR0ExVWREZ1FXQkJRTlN4dEV5cmFVWWV4bDMvYXBqeVJHdk54ZmNqQU1CZ05WSFJNQkFmOEVBakFBTUE0R0ExVWREd0VCL3dRRUF3SUZvREFUQmdOVkhTVUVEREFLQmdnckJnRUZCUWNEQWpBZ0JnTlZIU0FFR1RBWE1Bb0dDQ3FDRkFCTUJJRWpNQWtHQnlxQ0ZBQk1CRTB3VWdZSUt3WUJCUVVIQVFFRVJqQkVNRUlHQ0NzR0FRVUZCekFCaGpab2RIUndPaTh2YjJOemNDNWxhR1Y0TG1SbE9qSTFOakF2WldwaVkyRXZjSEpwZG1GMFpTOTNaV0l2YzNSaGRIVnpMMjlqYzNBd1N3WUZLeVFJQXdNRVFqQkFNRDR3UERBNk1EZ3dGZ3dVUW1WMGNtbGxZbk56ZE1Pa2RIUmxJRUZ5ZW5Rd0NRWUhLb0lVQUV3RU1oTVRNUzF6YldOaUxXUnZZM1J2Y2kxMllXeHBaREFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBSXVubHBrMms0YW1mcmFLcUcrWERmWEhsd2tSV3c5c0FRczhhZEREbENFODdZRUZEbmpQZHRMamY3aUcrSU9CTDhsSjFtRU1QY2xhajhSVC90L0N0elFJQWdLUjJpUmNEUlR3Ym5DeWFtYXV2Y0wvOTVPbkJqQnpIRkt2VUFvZUlLRnJsNFMybmZtb1dYbjRUNy9BNlNtMkI2RDZJTkM5UG1DSXJ5d0tVYUhoaGQ5TzI1Q0lOSE96Z3RZM01kRXRBbHVGUzJFSEtQMTNOVUtrNE5tTS9TK1pTSkUxZTIydFE3VHhnYVowUDcrZ2MxUWg5K1ZkRVJPS2J1cFR2UWV6QW1IOHN2Q216aVhyb0JSa2dPaUkrMFN1SjFobzdoS2tMUVRnc0NWMURTZ3RMcGNIa1FxZ1ZObU1KVkRTUXp4U2dzREZ4bGM3aTAxRVhkRUx4Nm1nK1JBPT0iXSwidHlwIjoiSldUIiwiY3R5IjoiTkpXVCJ9';

const CHALLENGE_MOCK = 'KuaS9tU7Z676Oz1w0v0vCIpgft21K8eiQKDkwP_HXdE';

const PAYLOAD_MOCK = 'eyJuand0IjoiS3VhUzl0VTdaNjc2T3oxdzB2MHZDSXBnZnQyMUs4ZWlRS0Rrd1BfSFhkRSJ9';
const PROTECTEDHEADER_MOCK =
  'eyJhbGciOiJQUzI1NiIsIng1YyI6WyJNSUlFcHpDQ0E0K2dBd0lCQWdJRVhFb3U3VEFOQmdrcWhraUc5dzBCQVFzRkFEQ0JoekVqTUNFR0ExVUVBd3dhUXk1RlNFVllMa2hWVFVGT0xVTkJNU0JVUlZOVUxVOU9URmt4TlRBekJnTlZCQXNNTEdWSVpXRnNkR2hGZUhCbGNuUnpMVU5CSUdSbGNpQlVaV3hsYldGMGFXdHBibVp5WVhOMGNuVnJkSFZ5TVJ3d0dnWURWUVFLREJObFNHVmhiSFJvUlhod1pYSjBjeUJIYldKSU1Rc3dDUVlEVlFRR0V3SkVSVEFlRncweU1UQTVNamd4TVRBME5EbGFGdzAwT0RFeU16QXlNekF3TURCYU1HVXhHakFZQmdOVkJBTU1FVlJsYzNRZ1VISmhlR2x6SUZaaGJHbGtNUnd3R2dZRFZRUUZFeE14TFhOdFkySXRaRzlqZEc5eUxYWmhiR2xrTVJ3d0dnWURWUVFLREJObFNHVmhiSFJvUlhod1pYSjBjeUJIYldKSU1Rc3dDUVlEVlFRR0V3SkVSVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFLa0tZNEtxMlpXUkNabnkrOGxyNjcvK3RucnVBSnB4akRQRHpQSU5sN1lDNlh0THI0WC9uUFZoQW0vN0E0T2hJdzNaRDgwdW4yeEcxelQwc2svU2xvWU55N0U1Q0hyd2JYeVRRRnNncy9LWTZZdjZxdEdIaHpKZ3haZ0N4aDUxZEVxTkFCTlhqZXVmT1B5YmlmaHBmVHVPTEJQV09NWnNtNytaMFl2SGFxY1dTTUllK1orQjZ0YWhuVTNwbUlCUXRWbTJQQ1JRNHk3SjJJYUdKSldEbVNPdTM3NGdaWjNQRCtkV0RoQjZuaEk0OXY1dGtFSWFMSDIyeWFHdzFxV2duT3R2Q0JTY2trY0txOGFjVC8wL3AvQ2x1Ulo2Zi9LVDlidDJGSHRPZHZxM3BBS3BzS3FpUXZ0S1hGUjJYc2JscStReTVkVXZGeEFsOWZkTk83dUJ2d3NDQXdFQUFhT0NBVG93Z2dFMk1COEdBMVVkSXdRWU1CYUFGT1BaWGd1N0ZWVnBKSXUybHJ0dnpFSGRCM3BmTUIwR0ExVWREZ1FXQkJRTlN4dEV5cmFVWWV4bDMvYXBqeVJHdk54ZmNqQU1CZ05WSFJNQkFmOEVBakFBTUE0R0ExVWREd0VCL3dRRUF3SUZvREFUQmdOVkhTVUVEREFLQmdnckJnRUZCUWNEQWpBZ0JnTlZIU0FFR1RBWE1Bb0dDQ3FDRkFCTUJJRWpNQWtHQnlxQ0ZBQk1CRTB3VWdZSUt3WUJCUVVIQVFFRVJqQkVNRUlHQ0NzR0FRVUZCekFCaGpab2RIUndPaTh2YjJOemNDNWxhR1Y0TG1SbE9qSTFOakF2WldwaVkyRXZjSEpwZG1GMFpTOTNaV0l2YzNSaGRIVnpMMjlqYzNBd1N3WUZLeVFJQXdNRVFqQkFNRDR3UERBNk1EZ3dGZ3dVUW1WMGNtbGxZbk56ZE1Pa2RIUmxJRUZ5ZW5Rd0NRWUhLb0lVQUV3RU1oTVRNUzF6YldOaUxXUnZZM1J2Y2kxMllXeHBaREFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBSXVubHBrMms0YW1mcmFLcUcrWERmWEhsd2tSV3c5c0FRczhhZEREbENFODdZRUZEbmpQZHRMamY3aUcrSU9CTDhsSjFtRU1QY2xhajhSVC90L0N0elFJQWdLUjJpUmNEUlR3Ym5DeWFtYXV2Y0wvOTVPbkJqQnpIRkt2VUFvZUlLRnJsNFMybmZtb1dYbjRUNy9BNlNtMkI2RDZJTkM5UG1DSXJ5d0tVYUhoaGQ5TzI1Q0lOSE96Z3RZM01kRXRBbHVGUzJFSEtQMTNOVUtrNE5tTS9TK1pTSkUxZTIydFE3VHhnYVowUDcrZ2MxUWg5K1ZkRVJPS2J1cFR2UWV6QW1IOHN2Q216aVhyb0JSa2dPaUkrMFN1SjFobzdoS2tMUVRnc0NWMURTZ3RMcGNIa1FxZ1ZObU1KVkRTUXp4U2dzREZ4bGM3aTAxRVhkRUx4Nm1nK1JBPT0iXSwidHlwIjoiSldUIiwiY3R5IjoiTkpXVCJ9';

const CERTIFICATE_MOCK =
  'MIIEpzCCA4+gAwIBAgIEXEou7TANBgkqhkiG9w0BAQsFADCBhzEjMCEGA1UEAwwaQy5FSEVYLkhVTUFOLUNBMSBURVNULU9OTFkxNTAzBgNVBAsMLGVIZWFsdGhFeHBlcnRzLUNBIGRlciBUZWxlbWF0aWtpbmZyYXN0cnVrdHVyMRwwGgYDVQQKDBNlSGVhbHRoRXhwZXJ0cyBHbWJIMQswCQYDVQQGEwJERTAeFw0yMTA5MjgxMTA0NDlaFw00ODEyMzAyMzAwMDBaMGUxGjAYBgNVBAMMEVRlc3QgUHJheGlzIFZhbGlkMRwwGgYDVQQFExMxLXNtY2ItZG9jdG9yLXZhbGlkMRwwGgYDVQQKDBNlSGVhbHRoRXhwZXJ0cyBHbWJIMQswCQYDVQQGEwJERTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKkKY4Kq2ZWRCZny+8lr67/+tnruAJpxjDPDzPINl7YC6XtLr4X/nPVhAm/7A4OhIw3ZD80un2xG1zT0sk/SloYNy7E5CHrwbXyTQFsgs/KY6Yv6qtGHhzJgxZgCxh51dEqNABNXjeufOPybifhpfTuOLBPWOMZsm7+Z0YvHaqcWSMIe+Z+B6tahnU3pmIBQtVm2PCRQ4y7J2IaGJJWDmSOu374gZZ3PD+dWDhB6nhI49v5tkEIaLH22yaGw1qWgnOtvCBSckkcKq8acT/0/p/CluRZ6f/KT9bt2FHtOdvq3pAKpsKqiQvtKXFR2Xsblq+Qy5dUvFxAl9fdNO7uBvwsCAwEAAaOCATowggE2MB8GA1UdIwQYMBaAFOPZXgu7FVVpJIu2lrtvzEHdB3pfMB0GA1UdDgQWBBQNSxtEyraUYexl3/apjyRGvNxfcjAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDAjAgBgNVHSAEGTAXMAoGCCqCFABMBIEjMAkGByqCFABMBE0wUgYIKwYBBQUHAQEERjBEMEIGCCsGAQUFBzABhjZodHRwOi8vb2NzcC5laGV4LmRlOjI1NjAvZWpiY2EvcHJpdmF0ZS93ZWIvc3RhdHVzL29jc3AwSwYFKyQIAwMEQjBAMD4wPDA6MDgwFgwUQmV0cmllYnNzdMOkdHRlIEFyenQwCQYHKoIUAEwEMhMTMS1zbWNiLWRvY3Rvci12YWxpZDANBgkqhkiG9w0BAQsFAAOCAQEAIunlpk2k4amfraKqG+XDfXHlwkRWw9sAQs8adDDlCE87YEFDnjPdtLjf7iG+IOBL8lJ1mEMPclaj8RT/t/CtzQIAgKR2iRcDRTwbnCyamauvcL/95OnBjBzHFKvUAoeIKFrl4S2nfmoWXn4T7/A6Sm2B6D6INC9PmCIrywKUaHhhd9O25CINHOzgtY3MdEtAluFS2EHKP13NUKk4NmM/S+ZSJE1e22tQ7TxgaZ0P7+gc1Qh9+VdEROKbupTvQezAmH8svCmziXroBRkgOiI+0SuJ1ho7hKkLQTgsCV1DSgtLpcHkQqgVNmMJVDSQzxSgsDFxlc7i01EXdELx6mg+RA==';
const jwsCIdpUtils = new GemIdpJwsOptions(CHALLENGE_MOCK, CERTIFICATE_MOCK, ECardTypes.SMCB);

describe('sign challenge utils', () => {
  it('creates sha256 hash', async () => {
    expect(jwsCIdpUtils.sha256Encode('a-test-string-to-hash')).toMatchSnapshot();
  });
  it('creates signing input string', async () => {
    expect(jwsCIdpUtils.createSigningInputString(BASE64_HEADER_MOCK, BASE64_PAYLOAD_MOCK)).toMatchSnapshot();
  });
  it('creates header and payload string', async () => {
    const erg = { protectedHeader: PROTECTEDHEADER_MOCK, payload: PAYLOAD_MOCK };
    expect(jwsCIdpUtils.createJwsOptions()).toStrictEqual(erg);
  });
});