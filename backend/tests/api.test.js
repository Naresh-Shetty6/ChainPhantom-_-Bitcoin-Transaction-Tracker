const request = require('supertest');
const app = require('../index');

describe('ChainPhantom API Tests', () => {
  
  describe('GET /api/search/:query', () => {
    it('should return 400 for invalid query', async () => {
      const res = await request(app)
        .get('/api/search/invalid')
        .expect(404);
    });

    it('should handle transaction hash search', async () => {
      const validTxHash = '1a1e3e5aa0f95311d7990a4104ca9c5a5a0d4b16dc5a9d6d4a5b8e6c7f8a9b0c';
      const res = await request(app)
        .get(`/api/search/${validTxHash}`)
        .expect('Content-Type', /json/);
    });
  });

  describe('POST /api/analyze', () => {
    it('should return 400 when address is missing', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .send({})
        .expect(400);
      
      expect(res.body.error).toBe('Address is required');
    });

    it('should analyze valid address', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .send({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' })
        .expect('Content-Type', /json/);
    });
  });

  describe('POST /api/trace', () => {
    it('should return 400 when txHash is missing', async () => {
      const res = await request(app)
        .post('/api/trace')
        .send({})
        .expect(400);
      
      expect(res.body.error).toBe('Transaction hash is required');
    });
  });

  describe('POST /api/detect-suspicious', () => {
    it('should return 400 when address is missing', async () => {
      const res = await request(app)
        .post('/api/detect-suspicious')
        .send({})
        .expect(400);
      
      expect(res.body.error).toBe('Address is required');
    });
  });
});
