const { expect } = require('chai');

const path = require('path');

const getIds = require('../index');

const pagePath = path.join('file:///', __dirname, 'page.html');

describe('it should get IDs', function testExample() {
  this.timeout(30000);

  it('gets the IDs', async () => {
    const ids = await getIds(pagePath);
    expect(ids).to.include.members(['3', '2', '1']);
  });
});
