const Router = require('express');
const config = require('config');
const authMiddleware = require('../middleware/auth.middleware')
const router = new Router();
const dbCon = require('../services/dbCon')

router.post('/add', authMiddleware,
    async (req, res) => {
        try {
            const {task, description} = req.body

            let date = new Date().toISOString().split('T')[0]

            dbCon.get('insert into task(task_name, description, user_id, date_modify)  values(?, ?, ?, ?) returning task_id as task_id;', task, description, req.user.id, date, (err, result) => {
                if (err) console.log(err)
                else return res.json({
                    task: {
                        task_id: result.task_id,
                        task_name: task,
                        task_description: description,
                        task_date: date, 
                    }
                })
            })

        } catch (error) {
            console.log(error)
            res.send({message: 'server error'})
        }
});

router.post('/get', authMiddleware,
    async (req, res) => {
        try {

            dbCon.all('select t.task_id as task_id, t.date_modify as date_modify, t.task_name as task_name , t.description as description from task t where t.user_id = ?;', req.user.id, (err, result) => {
                if (err) console.log(err)
                else return res.json(result)
            })

        } catch (error) {
            console.log(error)
            res.send({message: 'server error'})
        }
});

router.post('/delete', authMiddleware,
    async (req, res) => {
        try {
            const task_id = req.body.task_id

            dbCon.run('DELETE from task where task_id = ?;', task_id, (err) => {
                if (err) console.log(err)
                else return res.json({
                    task: {
                        task_id: task_id
                    }
                })
            })

        } catch (error) {
            console.log(error)
            res.send({message: 'server error'})
        }
});

router.post('/update', authMiddleware,
    async (req, res) => {
        try {
            const {task, description, task_id} = req.body

            dbCon.run('update task set task_name = ?, description = ? where task_id = ?;', task, description, task_id, (err) => {
                if (err) console.log(err)
                else return res.json({
                    task: {
                        task_id: task_id
                    }
                })
            })

        } catch (error) {
            console.log(error)
            res.send({message: 'server error'})
        }
});

module.exports = router;