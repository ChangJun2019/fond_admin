import React, { Fragment } from "react";
import { Layout, Icon } from "antd";
import GlobalFooter from "@/components/GlobalFooter";

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: "52chinaweb 首页",
          title: "52chinaweb 首页",
          href: "https://www.52chinaweb.com",
          blankTarget: true
        },
        {
          key: "github",
          title: <Icon type="github" />,
          href: "https://github.com/ChangJun2018",
          blankTarget: true
        },
        {
          key: "Ant Design",
          title: "Ant Design",
          href: "https://ant.design",
          blankTarget: true
        }
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 ChangJun@China
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
