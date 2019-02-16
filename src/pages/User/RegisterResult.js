import React from "react";
import { Button } from "antd";
import Link from "umi/link";
import Result from "@/components/Result";
import styles from "./RegisterResult.less";


const actions = (
  <div className={styles.actions}>
    <Link to="/User/Login">
      <Button size="large">立即去往登录页</Button>
    </Link>
    <Link to="/User/Register">
      <Button size="large">继续注册</Button>
    </Link>
  </div>
);


const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        你的账户：
        {location.state ? location.state.account : "779199489@qq.com"}
        注册成功
      </div>
    }
    description="恭喜你注册成功,您可以使用该账号登录。"
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;

