const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it('Should return the given partition key when given an object with partitionKey value set to string', () => {
    const partitionKey = "Hello";
    const key = deterministicPartitionKey({ partitionKey });
    expect(key).toBe(partitionKey);
  });

  it('Should return the JSON.stringify of given partition key when given an object with partitionKey value set to object', () => {
    const partitionKey = {
      objValue: 'Hello',
    };

    const key = deterministicPartitionKey({ partitionKey });
    expect(key).toBe(JSON.stringify(partitionKey));
  });

  it('Should return the hash of empty object when given an empty object', () => {
    const key = deterministicPartitionKey({});
    expect(key).toBe('c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862');
  });

  it('Should return the SHA3 partition key when event is given as plain string', () => {
    const key = deterministicPartitionKey("Hello world!");
    expect(key).toBe('e321481e1726bbacef9754592e2ac66a12bc96479c753ebf0aef3e32b4af91687dd4c1838811c6a59ca979711817a9de1b05bdf0fea5748eba481fc77d667d2f');
  });
});
