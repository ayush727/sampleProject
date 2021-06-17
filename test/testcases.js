const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app.js');

describe('POST /calculatebmi', () => {
    it('SUCCESS SCENARIO, passing correct values', (done) => {
        request(app).post('/calculatebmi')
          .send({
            "Gender":"Female",
            "Height":170,
            "Weight":80
        })
          .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('Gender');
            expect(body).to.contain.property('HeightCm');
            expect(body).to.contain.property('WeightKg');
            expect(body).to.contain.property('BMI');
            expect(body).to.contain.property('BMI_Category');
            expect(body).to.contain.property('Health_Risk');
            done();
          })
          .catch((err) => done(err));
      });

      it('FAILURE SCENARIO, missing required field', (done) => {
        request(app).post('/calculatebmi')
          .send({
            "Gender":"Female",
            "Weight":80
        })
          .then((res) => {
            const body = res.body;
            expect(body.error)
              .to.equal('Field required')
            done();
          })
          .catch((err) => done(err));
      });
})


describe('POST /usersbmi', () => {
  it('SUCCESS SCENARIO, document present', (done) => {
      request(app).post('/usersbmi')
        .send()
        .then((res) => {
          const body = res.body;
          expect(body[0]).to.contain.property('Gender');
          expect(body[0]).to.contain.property('HeightCm');
          expect(body[0]).to.contain.property('WeightKg');
          expect(body[0]).to.contain.property('BMI');
          expect(body[0]).to.contain.property('BMI_Category');
          expect(body[0]).to.contain.property('Health_Risk');
          done();
        })
        .catch((err) => done(err));
    });
})

describe('GET /count/:category', () => {
  it('SUCCESS SCENARIO, category present', (done) => {
      request(app).get('/count/Overweight')
        .send()
        .then((res) => {
          const body = res.body;
          expect(body).to.contain.property('Count');
          done();
        })
        .catch((err) => done(err));
    });

  it('FAILURE SCENARIO, category not present', (done) => {
    request(app).get('/count/Light')
      .send()
      .then((res) => {
        const body = res.body;
        expect(body.error).to.equal('Invalid category');
        done();
      })
      .catch((err) => done(err));
  });
})