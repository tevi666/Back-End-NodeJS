import express, { Request, Response } from 'express';
import { CourseApiModel } from './models/CourseApiModel';
import { CourseCreateModel } from './models/CourseCreateModel';
import { CourseUpdateModel } from './models/CourseUpdateModel';
import { CourseQueryModel } from './models/GetCursesQueryModel';
import { URIParamsCouseIDModel } from './models/URIParamsCourseIDModel';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types';

export const app = express();
const port = 3003;
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
    id: number
    title: string
    students: number
}

const db: {courses: CourseType[]} = {
    courses: [
        {id: 1, title: 'Front End', students: 10},
        {id: 2, title: 'Back End', students: 10},
        {id: 3, title: 'UI/UX', students: 10},
        {id: 4, title: 'HTML/CSS', students: 10}
    ]
}
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}

const getCourseApiModel = (dbCourse: CourseType): CourseApiModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}
app.get('/', (req,res) => {  
    res.send('welcome')
});

app.get('/courses', (req: RequestWithQuery<CourseQueryModel>, res: Response<CourseApiModel[]>) => {
    let foundCourse = db.courses
    if(req.query.title) {
        foundCourse = foundCourse
        .filter(c => c.title.indexOf(req.query.title) > -1)
    }

    res.json(foundCourse.map(getCourseApiModel));
});
app.get('/courses/:id', (req: RequestWithParams<URIParamsCouseIDModel>, res: Response<CourseApiModel>) => {  
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(getCourseApiModel(foundCourse));
});
app.post('/courses', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseApiModel>) => {
    if(!req.body.title.trim()) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newObj: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        students: 0
    }
    db.courses.push(newObj)
    res
        .status(201)
        .json(getCourseApiModel(newObj));
})
app.delete('/courses/:id', (req: RequestWithParams<URIParamsCouseIDModel>, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCouseIDModel, CourseUpdateModel>, res) => {  
    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});