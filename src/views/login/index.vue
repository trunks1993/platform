<template>
  <div class="login-container">
    <div class="login">
      <div class="login-header">
				<h3>统一管理平台登录界面</h3>
			</div>
      <div class="login-bottom">
        <div class="login-user">
          <img src="../../assets/login-left.png" />
          <span>用户登录</span>
          <img src="../../assets/login-right.png" />
        </div>
        <div class="login-input">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="username" class="user">
						<el-input
							v-model="ruleForm.username"
							name="username"
							placeholder="请输入账号"
							auto-complete="off"
							clearable
              class="inputfirst"							
						></el-input>
					</el-form-item>
					<el-form-item prop="password" class="pwd">
						<el-input
							v-model="ruleForm.password"
							name="password"
							placeholder="请输入密码"
							auto-complete="on"
							show-password
							clearable
							class="password"
						></el-input>
					</el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%" @click="login('ruleForm')">
                登录
              </el-button>
					</el-form-item>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
	name: 'login',
	data() {
		var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else if(value != 'admin'){
          callback(new Error('请输入正确账号'));
        } else {
          callback();
        }

    };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value != 'hz1505'){
        callback(new Error('密码错误'));	
        }else {
          callback();
        }
    };
		return {
			ruleForm: {
				username: 'admin',
				password: 'hz1505'
			},
			rules: {
				  username: [
					{ validator: validatePass, trigger: 'blur' }
				  ],
				  password: [
					{ validator: validatePass2, trigger: 'blur' }
				  ],
			}
		};
	},
	methods: {
		login(ruleForm) {
			this.$refs[ruleForm].validate((valid) => {
			  if (valid) {
            this.$store.dispatch('Login', {username: 'admin', password: 'hz1505'}).then(res => {
              this.$route.push('/')
            })
			  }
			});
    }
	}
};
</script>
<style lang="scss" scoped>
 .login-container{
   width: 100%;
	 height: 100%;
	 background: url(../../assets/login-Bg.png);
	 background-size: 100% 100%;
    .login{
	   width:566px;
	   height:690px;
	   text-align: center;
	   position: absolute;
     left: 0;
	   top: 0;
	   right: 0;
     bottom: 0;
	   margin: auto;
     .login-header{
        h3{
          text-align: center;
          color: #36E4FF;
          font-size: 36px;
          font-family:Source Han Serif SC;
          font-weight: 400;
        }
    }
   .login-bottom {
      width: 100%;
      height:445px;
      background: url(../../assets/login-bk.png);
      background-size: 100% 100%;
      z-index: 1;
      position: absolute;
      bottom: 0;
      left: 0;
      top:16%;
      box-sizing: border-box;
      padding: 12% 15%;
      .login-user{
        margin-bottom: 53px;
        span{
          text-align: center;
          font-size:18px;
          color:#63ACDF;
          margin: 0 5%;
        }
        img{
          vertical-align: bottom;
        }
      }
      .login-input{
        padding: 0 5%;
        .user{
          height: 90px;
        }
        .pwd{
          height: 78px;
        }
      }
      .login-input /deep/ .el-input__inner {
        background: url(../../assets/login-input.png);
        background-size: 100% 100%;
        border: none !important;
        height: 50px;
        position: relative;
        padding-left: 70px;
        color: #5AC1FF;
        // margin-top: 40px;
      }
      .login-input /deep/ .el-button{
         background: url(../../assets/login.png);
         background-size: 100% 100%;
         border: none;
         height: 48px;
         color: #FFFFFF;
      }
      .login-input /deep/ .inputfirst:before{
          content: '';
          background: url(../../assets/login-userName.png);
          display: inline-block;
          width: 20px;
          height: 24px;
          position: absolute;
          left: 5%;
          top: 28%;
          z-index: 999;
      }
      .login-input /deep/ .password:before{
          content: '';
          background: url(../../assets/login-pwd.png);
          display: inline-block;
          width: 20px;
          height: 24px;
          position: absolute;
          left: 5%;
          top: 28%;
          z-index: 999;
      }
    }
   }

 }
 
 
</style>
