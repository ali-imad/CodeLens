import { should, use } from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import 'mocha';

const chai = use(chaiHttp);
const baseURL = 'http://localhost:3000';

describe('Problem API', () => {
  const problemData = {
    title: 'Two Sum',
    difficulty: 'Easy',
    functionBody: `
      function twoSum(nums: number[], target: number): number[] {
        const map: { [key: number]: number } = {};
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (complement in map) {
            return [map[complement], i];
          }
          map[nums[i]] = i;
        }
        throw new Error("No two sum solution");
      }
    `,
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
      { input: { nums: [1, 2, 3, 4, 5], target: 8 }, expectedOutput: [2, 4] },
      { input: { nums: [1, 5, 5, 2], target: 10 }, expectedOutput: [1, 2] },
    ],
  };

  it('should create a new problem', done => {
    chai
      .request(baseURL)
      .post('/problems')
      .send(problemData)
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('title').eql(problemData.title);
        res.body.should.have.property('difficulty').eql(problemData.difficulty);
        res.body.should.have
          .property('testCases')
          .that.is.an('array')
          .with.lengthOf(5);

        res.body.testCases.forEach((testCase: any, index: number) => {
          testCase.should.have.property('input');
          testCase.input.should.have
            .property('nums')
            .eql(problemData.testCases[index]?.input.nums);
          testCase.input.should.have
            .property('target')
            .eql(problemData.testCases[index]?.input.target);
          testCase.should.have
            .property('expectedOutput')
            .eql(problemData.testCases[index]?.expectedOutput);
        });

        done();
      });
  });

  it('should get all problems', done => {
    chai
      .request(baseURL)
      .get('/problems')
      .end((err, res) => {
        should().not.exist(err);
        should().exist(res);
        res.should.have.status(200);
        res.body.should.be.an('array');
        done();
      });
  });
});
