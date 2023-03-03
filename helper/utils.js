exports.randomStringGenerate = async (x)=>{
    const randomString = require("randomstring");
    return randomString.generate(x);
}

exports.slugify = (string)=>{
    const slugify = require("slugify");
    return slugify(string)
}