import request from 'supertest';
import { CourseCreateModel } from '../../src/models/CourseCreateModel';
import { CourseUpdateModel } from '../../src/models/CourseUpdateModel';
import { app, HTTP_STATUSES } from '../../src/server';
describe('/course', () => {
    beforeAll(async() => {
        await request(app).delete('/__test__/data')
    })
    it('should return 200 and empty array', () => {
        request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing course', () => {
        request(app)
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should'nt create course with incorrect input data`, async() => {
        const data: CourseCreateModel = { title: '' };
        await request(app)
        .post('/courses')
        .send(data)
        .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    let crtCrs: any = null
    it(`should create course with correct input data`, async() => {
        const data: CourseCreateModel = { title: 'new course' };
        const res = await request(app)
        .post('/courses')
        .send(data)
        .expect(HTTP_STATUSES.CREATED_201)

        crtCrs = res.body;
        expect(crtCrs).toEqual({
            id: expect.any(Number),
            title: 'new course'
        })
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [crtCrs])
    })
    let crtCrs2: any = null
    it(`create one more course`, async() => {
        const data: CourseCreateModel = { title: 'new course 2' };

        const res = await request(app)
        .post('/courses')
        .send(data)
        .expect(HTTP_STATUSES.CREATED_201)

        crtCrs2 = res.body;
        expect(crtCrs2).toEqual({
            id: expect.any(Number),
            title: data.title
        })
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [crtCrs, crtCrs2])
    })
    it(`should'nt update course with incorrect input data`, async() => {
        const data: CourseCreateModel = { title: '' };
        await request(app)
        .put(`/courses/` + crtCrs.id)
        .send(data)
        .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + crtCrs.id)
            .expect(HTTP_STATUSES.OK_200, crtCrs)
    })
    it(`should'nt update course that no exist`, async() => {
        await request(app)
        .put(`/courses/` + -100)
        .send({title: 'good title'})
        .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should update course with correct input data`, async() => {
        const data: CourseUpdateModel = { title: 'good new title' };

        await request(app)
        .put(`/courses/` + crtCrs.id)
        .send(data)
        .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + crtCrs.id)
            .expect(HTTP_STATUSES.OK_200, {...crtCrs,
            title: data.title
            })

        await request(app)
            .get('/courses/' + crtCrs2.id)
            .expect(HTTP_STATUSES.OK_200, crtCrs2)
    })
    it(`should delete both courses`, async() => {
        await request(app)
        .delete(`/courses/` + crtCrs.id)
        .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + crtCrs.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`/courses/` + crtCrs2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + crtCrs2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})