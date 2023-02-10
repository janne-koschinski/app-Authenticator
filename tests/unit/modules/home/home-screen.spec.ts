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

import { mount } from '@vue/test-utils';
import { HomeScreen } from '@/renderer/modules/home/screens';
import i18n from '@/renderer/i18n';
import store from '@/renderer/store';
import { FileStorageRepository } from '@/renderer/modules/settings/repository';

const fileStorageRepository = new FileStorageRepository();

jest.mock('@/renderer/modules/settings/useSettings.ts', () => ({
  useSettings: () => {
    return fileStorageRepository;
  },
}));

describe('home screen', () => {
  beforeEach(() => {
    fileStorageRepository.clear();
  });

  it('render with settings button', async function () {
    const wrapper = mount(HomeScreen, {
      global: {
        plugins: [store, i18n],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render with loading spinner', async function () {
    await store.commit('setShowLoadingSpinner', true);

    const wrapper = mount(HomeScreen, {
      global: {
        plugins: [store, i18n],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});