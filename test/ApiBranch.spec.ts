import { assert } from 'chai';
import * as fetchMock from 'fetch-mock';
import {
  mockApiUrl,
  mockTranslation,
  mockTranslations
} from './mocks/apiTranslations';
import { Branch, Empty } from '../src';
import { API_URL } from './mocks/utils';

describe('active: ApiBranch', () => {
  const branch = new Branch(0, mockTranslations[1].value);

  afterEach(() => fetchMock.restore());

  it('should get from api', async () => {
    fetchMock.get(mockApiUrl('hello', 'en', 'en,nb'), mockTranslation);
    const empty = branch.find('hello') as Empty;
    assert.isTrue(empty instanceof Empty);
    const api = await empty.fromApi('en', ['en', 'nb']);
    assert.deepEqual(api, mockTranslation);
  });

  it('should return 404 with not found to add into API', async () => {
    fetchMock.get(
      mockApiUrl('hello', 'en', 'en,en'),
      { status: 404, message: 'notFound' },
      { response: { status: 404 } }
    );
    const empty = branch.find('hello') as Empty;
    assert.isTrue(empty instanceof Empty);
    try {
      await empty.fromApi('en', ['en', 'nb']);
    } catch (e) {
      assert.ok(e);
    }
  });

  it('should post translation to api', async () => {
    fetchMock.post(`${API_URL}/translations`, mockTranslation);
    const found = branch.find(mockTranslations[1].value) as Branch;
    const res = await found.toApi('en');
    assert.deepEqual(res, mockTranslation);
  });
});
