const ObjectId = require("mongodb").ObjectId

exports.randomStringGenerate = async (x)=>{
    const randomString = require("randomstring");
    return randomString.generate(x);
}

exports.checkObjectId = (val) => {
    return ObjectId.isValid(val)
  }




