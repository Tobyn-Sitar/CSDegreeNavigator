const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 8000;

app.use(cors()); 
app.use(express.json()); 

app.post('/', (req, res) => {
  const { firstName, lastName, age, role, classes, comment } = req.body; 
  console.log('Received Data:', { firstName, lastName, age, role, classes, comment });

  res.json({
    message: 'Data received successfully!',
    receivedData: { firstName, lastName, age, role, classes, comment }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
