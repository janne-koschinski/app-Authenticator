import { TestResult, TestStatus } from '@/renderer/modules/settings/services/test-runner';
import { logger } from '@/renderer/service/logger';
import i18n from '@/renderer/i18n';
import { getCaCertsWithFilenames } from '@/renderer/utils/read-tls-certificates';
import { checkPemFileFormatSilent, PEM_TYPES } from '@/renderer/utils/pem-file-validator';

const translate = i18n.global.tc;

export async function certsValidityTest(): Promise<TestResult> {
  try {
    const certs = [...getCaCertsWithFilenames(true), ...getCaCertsWithFilenames(false)];

    let totalCerts = 0;
    let notValidCerts = 0;

    await Promise.all(
      certs.map(async ({ name, cert }) => {
        if (!(await checkPemFileFormatSilent(cert, PEM_TYPES.CERT))) {
          logger.info(notValidCerts, name, 'not valid');
          notValidCerts++;
        }
        totalCerts++;
      }),
    );

    logger.info('total certs:', totalCerts);
    logger.info('invalid certs:', notValidCerts);

    if (notValidCerts > 0) {
      return {
        name: translate('certs_validity'),
        status: TestStatus.failure,
        details: translate('certs_validity_failure', { totalCerts: totalCerts, notValidCerts: notValidCerts }),
      };
    } else
      return {
        name: translate('certs_validity'),
        status: TestStatus.success,
        details: translate('certs_validity_successful', { totalCerts: totalCerts }),
      };
  } catch (err) {
    logger.debug(err);
    return {
      name: translate('certs_validity'),
      status: TestStatus.failure,
      details: translate('error_info') + `${err.message}`,
    };
  }
}