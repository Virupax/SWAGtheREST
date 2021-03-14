const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const app = express();
const port = 3000;
const axios = require('axios');
const AWSLAMBDAGETURL = "https://gh8kerpd95.execute-api.us-east-1.amazonaws.com/default/my-function?keyword=";

const mariadb = require('mariadb');
const pool = mariadb.createPool({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'sample',
		port: 3306,
		connectionLimit: 5
});
const options = {
  swaggerDefinition: {
    info: {
      title: 'SWAGGERtheRESTwithMariaDB',
      version: '1.0.0',
      description: 'Demonstrate REST like APIs with SWAGGER using MariaDb'
    },
    host: '161.35.50.137:3000',
    basePath: '/'
  },
  apis: ['./server.js'],
};
const specs = swaggerJsdoc(options);

app.use(express.json());
app.use(express.urlencoded()); 
app.use(upload.array());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());


app.get('/say',(req, res) => {
  axios.get(AWSLAMBDAGETURL + req.query.keyword)
  .then(function (response) {
    // handle success
    console.log(response);
    res.end(JSON.stringify(response.data));
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
});


/**
 * @swagger
 * /customers:
 *    get:
 *      summary: Return all customers
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all student records
 */
app.get('/customers',(req, res) => {
	res.setHeader('Content-Type', 'application/json');
	pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT * FROM customer")
        .then((result) => {
          res.end(JSON.stringify(result));
          conn.end();
        })
        .catch(err => {
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
    });
});

/**
 * @swagger
 * /orders:
 *    get:
 *      summary: Return all orders
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all orders
 */
app.get('/orders',(req, res) => {
	res.setHeader('Content-Type', 'application/json');
	pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT * FROM orders")
        .then((result) => {
          res.end(JSON.stringify(result));
          conn.end();
        })
        .catch(err => {
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
    });
});

/**
 * @swagger
 * /students:
 *    get:
 *      summary: Return all students
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all students records
 */
app.get('/students',(req, res) => {
	res.setHeader('Content-Type', 'application/json');
	pool.getConnection()
    .then(conn => {
    
      conn.query("SELECT * FROM student")
        .then((result) => {
          res.end(JSON.stringify(result));
          conn.end();
        })
        .catch(err => {
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
    });
});


/**
 * @swagger
 * /agent:
 *    post:
 *      summary: Insert a new record for agent
 *      parameters:
 *        - in: formData
 *          name: AGENT_CODE
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: AGENT_NAME
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: WORKING_AREA
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COMMISSION
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: PHONE_NO
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COUNTRY
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          201:
 *              description: Successfully new agent is inserted!!
 *          500:
 *              description: Internal Server Error, Could not insert new record.
 */
app.post('/agent', function(req,res){
  //By default I am requiring all of them
  pool.getConnection()
    .then(conn => {
      let sql ="insert into agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) values (?)";
      let values = [req.body.AGENT_CODE, req.body.AGENT_NAME, req.body.WORKING_AREA,req.body.COMMISSION,req.body.PHONE_NO,req.body.COUNTRY];
      conn.query(sql, [values])
      .then(result => {
        res.json({
          status: 200,
          message: "Successfully inserted new record."
        });
        conn.end();
      })
      .catch(err => {
        console.log(err);
        conn.end();
        if (err) {
          res.json({
            status: 500,
            message: "Could not insert new record. Error Code:" + err.code
          });
        }
      });
    })
    .catch(err => {
    });
  });


/**
 * @swagger
 * /agent:
 *    put:
 *      summary: Updates a existing record for agent
 *      parameters:
 *        - in: formData
 *          name: AGENT_CODE
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: AGENT_NAME
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: WORKING_AREA
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COMMISSION
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: PHONE_NO
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COUNTRY
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully updated the record
 *          500:
 *              description: Internal Server Error, Could not update the record.
 */
 app.put('/agent', function(req,res){
    pool.getConnection()
    .then(conn => {
      let sql ="UPDATE agents SET  AGENT_NAME = ?, WORKING_AREA = ?, COMMISSION = ?, PHONE_NO = ?, COUNTRY = ? WHERE AGENT_CODE = ?";
      let values = [req.body.AGENT_NAME, req.body.WORKING_AREA,req.body.COMMISSION,req.body.PHONE_NO,req.body.COUNTRY, req.body.AGENT_CODE];
      conn.query(sql, values)
        .then(result => {
          res.json({
            status: 200,
            message: "Successfully updated the record."
          });
          conn.end();
        })
        .catch(err => {
          console.log(err);
          conn.end();
          if (err) {
            res.json({
              status: 500,
              message: "Could not update the record. Error Code:" + err.code
            });
          }
        });
    })
    .catch(err => {
    });
  });


/**
 * @swagger
 * /agent:
 *    patch:
 *      summary: Patches a existing record for agent
 *      parameters:
 *        - in: formData
 *          name: AGENT_CODE
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: AGENT_NAME
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully patched the record
 *          500:
 *              description: Internal Server Error, Could not patch the record.
 */
 app.patch('/agent', function(req,res){
  pool.getConnection()
  .then(conn => {
    let sql ="UPDATE agents SET  AGENT_NAME = ? WHERE AGENT_CODE = ?";
    let values = [req.body.AGENT_NAME, req.body.AGENT_CODE];
    conn.query(sql, values)
      .then(result => {
        res.json({
          status: 200,
          message: "Successfully patched the record."
        });
        conn.end();
      })
      .catch(err => {
        console.log(err);
        conn.end();
        if (err) {
          res.json({
            status: 500,
            message: "Could not patch the record. Error Code:" + err.code
          });
        }
      });
  })
  .catch(err => {
  });
});


/**
 * @swagger
 * /agent/{id}:
 *    delete:
 *      summary: Deletes an agent record for matching id
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          204:
 *              description: Successfully deleted the record
 *          500:
 *              description: Internal Server Error, Could not delete the record.
 */
app.delete('/agent/:id', function (req, res) {
  pool.getConnection()
    .then(conn => {
      let sql = "DELETE FROM agents WHERE AGENT_CODE = ?";
      conn.query(sql, req.params.id)
        .then(result => {
          res.json({
            status: 200,
            message: "Successfully deleted the record."
          });
          conn.end();
        })
        .catch(err => {
          console.log(err);
          conn.end();
          if (err) {
            res.json({
              status: 500,
              message: "Could not delete the record. Error Code:" + err.code
            });
          }
        });
    })
    .catch(err => {
    });
});

  
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});