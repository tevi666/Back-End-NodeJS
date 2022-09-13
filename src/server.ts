import express from 'express';

export const app = express();
const port = 3003;
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
    courses: [
        {id: 1, title: 'Front End'},
        {id: 2, title: 'Back End'},
        {id: 3, title: 'UI/UX'},
        {id: 4, title: 'HTML/CSS'}
    ]
}
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}
app.get('/', (req, res) => {  
    res.send('welcome')
});

app.get('/courses', (req, res) => {
    let foundCourse = db.courses
    if(req.query.title) {
        foundCourse = foundCourse
        .filter(c => c.title.indexOf(req.query.title as string) > -1)
    }

    res.json(foundCourse);
});
app.get('/courses/:id', (req, res) => {  
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(foundCourse);
});
app.post('/courses', (req, res) => {
    if(!req.body.title.trim()) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newObj = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(newObj)
    res
        .status(201)
        .json(newObj);
})
app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req, res) => {  
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