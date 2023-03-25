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







