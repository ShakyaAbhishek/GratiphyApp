export function emailValidation(data) {
    if (data === '' || data === null || data === undefined) {
      return { status: false, message: '*Please enter your email id/username.' }
    } else {
      return { status: true, message: '' };
    }
  }
  
  export function passwordValidation(data) {
    if (data === '' || data === null || data === undefined) {
      return { status: false, message: '*Please provide a valid password.' }
    } else {
      return { status: true, message: '' };
    }
  }
  
  // Username validation handler
  export function checkUserName(username) {
    var usernameRegex = /^[a-zA-Z0-9\.\d\-\_]{2,30}$/;
    if (username == "" || username == undefined || username == null) {
      return { status: false, message: "*Please enter username." };
    } else if (!usernameRegex.test(username)) {
      return { status: false, message: "*Please use english letters, digits, underscore, dash or dot." };
    }
    else if (username.length < 5) {
      return { status: false, message: "*Username can't be shorter than 5 characters." };
    } else if (username.length > 30) {
      return { status: false, message: "*Username can't be longer than 30 symbols." };
    } else {
      return { status: true, message: '' };
    }
  }
  
  // Email validation handler
  export function validateEmail(text) {
    //var emailRegex = /(?=^.{8,100}$)([a-zA-Z\d*])+(\.?)([a-zA-Z\d*])*@{1}([a-zA-z\d*])+(\.){1}([a-zA-Z\d*]){2,}/
    // /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,4}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let email = text.trim();
    if (email == "" || email == undefined || email == null) {
      return { status: false, message: "*Please enter email." };
    } else if (!emailRegex.test(email)) {
      return { status: false, message: "*Please enter valid email." };
    } else {
      return { status: true, message: '' };
    }
  }
  
  
  
  // Password validation handler
  export function validatePassword(text) {
    var passwordRegex = /^(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/
  
    // /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?& ]{8,13}$/
  
    // /^(?=.*\d)(?=.*[a-zA-Z!@#$^+=])/
    let password = text
    console.log(password)
    if (password == "" || password == undefined || password == null) {
      return { status: false, message: "*Please enter password." };
    }
    // else if (password.length < 8) {
    //   return { status: false, message: "Too short." };
    // } 
    else if (!passwordRegex.test(password)) {
      return { status: false, message: "*Password must be 8-13 characters long, must have 1 lowercase, 1 uppercase, 1 number & a special character eg. !@#$%^&." };
    } else {
      return { status: true, message: '' };
    }
  }
  
  
  // Phone no validation
  export function validatePhoneNo(phoneNo) {
    // var phonenoRegex = /^\d{14}$/
    if (phoneNo == "" || phoneNo == undefined || phoneNo == null) {
      return { status: false, message: "*Please enter mobile number." };
    }
    else if (phoneNo.length < 8) {
      return { status: false, message: "*Please enter valid mobile number." };
    }
    // else if (phoneNo.length != 14) {
    //   return { status: false, message: "*Please enter valid mobile number." };
    // }
    else {
      return { status: true, message: '' };
    }
  }
  
  // resturent code 
  export function validateRestoCode(code) {
    if (code == "" || code == undefined || code == null) {
      return { status: false, message: "*Please enter code number." };
    }
    else if (code.length < 4) {
      return { status: false, message: "*Please enter valid code number." };
    }
    else {
      return { status: true, message: '' };
    }
  }

   //end

    // if (this.state.restaurantName == '' || this.state.restaurantName === null || this.state.restaurantName === undefined) {
    //   this.setState({
    //     RestaurantNameErr: "*Please enter restaurent name",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent name")
    //   })
    // }
    // if (this.state.restaurantContactNo == '' || this.state.restaurantContactNo === null || this.state.restaurantContactNo === undefined) {
    //   this.setState({
    //     RestaurantContactErr: "*Please enter restaurent contact",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent contact")
    //   })
    // }
    // else if (this.state.restaurantContactNo != '') {
    //   if (this.state.restaurantContactNo.length < 10) {
    //     this.setState({
    //       RestaurantContactErr: "*Please enter valid contact number",
    //       errMessageArr: errMessageArr.push("*Please enter valid contact number")
    //     })
    //   }
    // }

    // if (this.state.priceCategory == '' || this.state.priceCategory === null || this.state.priceCategory === undefined) {
    //   this.setState({
    //     priceCategoryErr: "*Please enter restaurent contact",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent contact")
    //   })
    // }

    // if (this.state.restaurantCode == '' || this.state.restaurantCode === null || this.state.restaurantCode === undefined) {
    //   this.setState({
    //     RestaurantCodeErr: "*Please enter restaurent 4 digit code",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent 4 digit code")
    //   })
    // }
    // else if (this.state.restaurantCode != '') {
    //   if (this.state.restaurantCode.length < 4) {
    //     this.setState({
    //       RestaurantCodeErr: "*Please enter valid code",
    //       errMessageArr: errMessageArr.push("*Please enter valid code")
    //     })
    //   }
    // }
    // if (this.state.RestaurantEmail == '' || this.state.RestaurantEmail === null || this.state.RestaurantEmail === undefined) {
    //   this.setState({
    //     RestaurantEmailErr: "*Please enter restaurent email",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent email")
    //   })
    // }
    // if (this.state.RestaurantEmail != '') {
    //   var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    //   if (!emailRegex.test(this.state.RestaurantEmail)) {
    //     this.setState({
    //       RestaurantEmailErr: "*Please enter valid email",
    //       errMessageArr: errMessageArr.push("*Please enter valid email")
    //     })
    //   }
    // }
    // if (this.state.RestaurantPassword == '' || this.state.RestaurantPassword === null || this.state.RestaurantPassword === undefined) {
    //   this.setState({
    //     RestaurantPasswordErr: "*Please enter restaurent password",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent password")
    //   })
    // }
    // else if (this.state.RestaurantPassword != '') {
    //   var passwordRegex = /^(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/
    //   if (!passwordRegex.test(this.state.RestaurantPassword)) {
    //     this.setState({
    //       RestaurantPasswordErr: "*Password  must have 1 lowercase, 1 uppercase, 1 number & a special character eg. !@#$%^&.",
    //       errMessageArr: errMessageArr.push("*Password  must have 1 lowercase, 1 uppercase, 1 number & a special character eg. !@#$%^&.")
    //     })
    //   }
    // }

    // if (this.state.RestaurantConfirmPassword != '') {
    //   if (this.state.RestaurantPassword != this.state.RestaurantConfirmPassword) {
    //     this.setState({
    //       RestaurantConfirmPasswordErr: "*Please enter same password",
    //       errMessageArr: errMessageArr.push("*Please enter same password")
    //     })
    //   }

    // }
    // if (this.state.RestaurantConfirmPassword == '') {
    //   this.setState({
    //     RestaurantConfirmPasswordErr: "*Please enter restaurent confirm password",
    //     errMessageArr: errMessageArr.push("*Please enter restaurent confirm password")
    //   })
    // }
    // setTimeout(() => {
    //   if (this.state.errMessageArr.length == 0) {
    //     alert("inside success")
    //     //this.props.navigation.navigate('AppDrawer')
    //   }
    // }, 500)