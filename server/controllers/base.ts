abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = async (req, res) => {
    try {
      const docs = await this.model.find({});
      res.status(200).json(docs);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  // Count all
  count = async (req, res) => {
    try {
      const count = await this.model.count();
      res.status(200).json(count);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Insert
  insert = async (req, res) => {
    console.log('uso u post')
    try {
      const obj = await new this.model(req.body).save();
      console.log(req.body)
      res.status(201).json(obj);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Get by id
  get =  async (req, res) => {
    console.log('get by id')
    try {
 
      const obj = await this.model.findOne({ _id: req.params.id });
      console.log(obj)
      res.status(200).json(obj);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
   
  }

  customGet= async(req,res)=>{
     try{
      var query= { author: req.params.id};
      this.model.find(query, function(err, doc) {
        if (err){
            // error
            throw err;
        } else if (doc) {
            // film exists
            console.log("Film is "+doc);
            res.status(200).json(doc);
        } 
    });
    }
    catch(err){
      return res.status(500).json({ error: err.message });
    }
  }

  // Update by id
  update = async (req, res) => {
    console.log('uso u update')
    try {
      await this.model.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.send(req.body).status(200);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Delete by id
  delete = async (req, res) => {
    try {
      await this.model.findOneAndRemove({ _id: req.params.id });
      res.sendStatus(200);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default BaseCtrl;
