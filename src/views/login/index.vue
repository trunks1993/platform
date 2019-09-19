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
            <el-form-item class="login-in" style="width:100%;">
              <div style="width:100%;" @click="login('ruleForm')">
                登  录
              </div>
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
        } else {
          callback();
        }

    };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else {
          callback();
        }
    };
		return {
			ruleForm: {
				username: 'admin',
				password: '123456'
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
      let self = this;
			this.$refs[ruleForm].validate((valid) => {
			  if (valid) {
          this.$store.dispatch('Login', this.ruleForm).then(res => {
            this.$router.push('/')
          })
			  }
			});
    },
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
          width: 100%;
          height: 90px;
        }
        .pwd{
          width: 100%;
          height: 78px;
        }
      }
      .login-input /deep/ .el-input__inner {
        width: 100%;
        background: url(../../assets/login-input.png) !important;
        background-size: 100% 100% !important;
        border: none !important;
        height: 50px !important;
        position: relative;
        padding-left: 50px;
        color: #5AC1FF;
        // margin-top: 40px;
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
      .login-input /deep/ .el-form-item__error{
        color: red;
        font-size: 14px;
        text-align: left;
        text-indent: 5px;
      }
      .login-input /deep/ .el-input--suffix .el-input__suffix-inner{
        display: none;
      }
      .login-input /deep/ .el-form-item{
          margin-bottom: 0;
          margin-right: 0;
      }
      .login-input /deep/ .el-form-item__content{
          width:100%;
      }
     .login-input /deep/ .login-in .el-form-item__content{
       height: 48px;
       line-height: 48px;
       font-size: 18px;
       background:url(../../assets/login.png);
       color: #fff;
     }
    }
  }
 }
 
</style>