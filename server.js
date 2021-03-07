const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const app = express();
const port = 3000;

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

/**
 * @swagger
 * /customers:
 *    get:
 *      description: Return all customers
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
 *      description: Return all orders
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
 *      description: Return all students
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
 *      description: Insert a new record for agent
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
  let sql ="insert into agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) values (?)";
  let values = [req.body.AGENT_CODE, req.body.AGENT_NAME, req.body.WORKING_AREA,req.body.COMMISSION,req.body.PHONE_NO,req.body.COUNTRY];
  dbcon.query(sql, [values], function(err, data, fields){
  
        if (error) {
          res.json({
            status: 500,
            message: "Could not insert new record."
          })  
        };
        res.end(JSON.stringify(data));
        conn.end();
      });
  });


/**
 * @swagger
 * /agent:
 *    put:
 *      description: Return all students
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all students records
 */
 app.post('/agent/:id', function(req,res){


  res.setHeader('Content-Type', 'application/json');
	pool.getConnection()
    .then(conn => {    
      conn.query("SELECT * FROM agents WHERE AGENT_CODE=" + id)
        .then((result) => {
          if(result.AGENT_CODE == id){
            let sql ="insert into agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) values (?)";
            let values = [req.body.AGENT_CODE, req.body.AGENT_NAME, req.body.WORKING_AREA,req.body.COMMISSION,req.body.PHONE_NO,req.body.COUNTRY];
            dbcon.query(sql, [values], function(err, data, fields){          
                if (error) throw error;
                res.end(JSON.stringify(data));
            });       
          }
          conn.end();
        })
        .catch(err => {
          console.log(err); 
          conn.end();
        })
        
    }).catch(err => {
    });



  });

  
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});