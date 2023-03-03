exports.name= (string)=> {
    
    if (string === undefined || typeof string != 'string') {
      return false;
    }
    var string = string.trim();
    var letters = /^[A-Za-z ]+$/;
    if (
      string.length < 2 ||
      string.length > 50 ||
      string.match(letters) === null
    ) {
      return false;
    } else {
      return true;
    }
  }

  exports.email= (string)=> {
    
    if (string === undefined || typeof string != 'string') {
      return false;
    }
    var string = string.trim();
    var comValid = true;
    var atpos = string.indexOf('@');
    var dotpos = string.lastIndexOf('.');
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= string.length) {
      comValid = false;
    }
    var letters = /^[A-Z0-9a-z!@#$%&*+-/=?^_`'{|}~]+$/;
    if (
      string.length < 5 ||
      string.length > 50 ||
      string.match(letters) === null ||
      string.match('@') === null ||
      comValid === false
    ) {
      return false;
    } else {
      return true;
    }
  }
  exports.mobile= (string)=>{
    
    if (string === undefined || typeof string != 'string') {
      return false;
    }
    var string = string.trim();
    var letters = /^[0-9]+$/;
    if (string.length != 10 || string.match(letters) === null) {
      return false;
    } else {
      return true;
    }
  }


  exports.password = (string)=>{
    if(string === undefined || typeof string != 'string'){
      return false
    }

    let exp = /^[0-9a-zA-Z@]+$/
    let formatValid = true;

    let specialChar = /[$&+,:;=?@#|'<>.^*()%!-]/

    if(string.length< 6 || string.length>15 || string.match(exp) === null || string.match(specialChar) === null){
      return false
    }
    else{
      return true
    }
  }


exports.gender = (string)=>{
  
  if(string === undefined || typeof string != "string"){
    return false;
  }

  

  let genders = ["male","female","transgender"]

  if(!genders.includes(string)){
    return false
  }
  else{
    return true
  }
}


exports.paymentInfoValidate = (paymentDetails)=>{

  if(typeof paymentDetails != "object"){
    return {status:false, statusMessage:"Internal server error"};
  }
  let {upiNumber,accountNumber,ifscCode,accountName,bankAccountName,creditCardNumber} = paymentDetails || {}

  if(accountNumber){

    let regex = /^[0-9]+$/

    if( typeof accountNumber != "string"|| accountNumber.length <8 || accountNumber.length>18 || accountNumber.match(regex) == null){
      return {status:false, statusMessage:"Invalid accountNumber"};
    }
    
  }

  if(creditCardNumber){

    let regex = /^[0-9]+$/

    if(typeof creditCardNumber != "string" ||creditCardNumber.length != 18 || creditCardNumber.match(regex) == null){
      return {status:false, statusMessage:"Invalid creditCardNumber"};
    }
    
  }

  if(accountName){

    let res = this.name(accountName);
    if(!res){
      return {status:false, statusMessage:"Invalid accountName"};
    }
    
  }

  if(bankAccountName){

    let res = this.name(bankAccountName);
    if(!res){
      return {status:false, statusMessage:"Invalid bankAccountName"};
    }
    
  }

  if(upiNumber){
    let regex = /^[A-Z0-9a-z]+$/
 
    if(typeof upiNumber != "string" || upiNumber.length<5 || upiNumber.length>20 || upiNumber.startsWith("@") || !upiNumber.includes("@")){
      return {status:false, statusMessage:"Invalid upiNumber"};
    }
  }
  if(ifscCode){
    let regex = /^[A-Z0-9a-z]+$/

    if(typeof ifscCode != "string" || ifscCode.length != 11 || ifscCode.match(regex) == null){
      return {status:false, statusMessage:"Invalid ifscCode"};
    }
  }
  
    
    return {status:true, statusMessage:"true"};
  
}

