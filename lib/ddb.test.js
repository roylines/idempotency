const {put} = require('./ddb');
const AWS = require('aws-sdk');
jest.mock('aws-sdk');

describe('put', () => {
  it('should call aws-sdk correctly', async () => {
    const data = {bar: 'foo'};
    const mockPromise = jest.fn().mockResolvedValue(data);
    const mockPut = jest.fn().mockReturnValue({promise: mockPromise});
    AWS.DynamoDB.DocumentClient.mockImplementation(() => ({put: mockPut}));

    const params = {foo: 'bar'};
    const ret = await put(params);

    expect(ret).toEqual(data);
    expect(mockPut.mock.calls).toHaveLength(1);
    expect(mockPut.mock.calls[0]).toEqual([params]);
    expect(mockPromise.mock.calls).toHaveLength(1);
    expect(mockPromise.mock.calls[0]).toEqual([]);
  });
});
