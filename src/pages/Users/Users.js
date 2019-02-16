/**
 * @Time: 2018/12/23 14:22
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc:  用户管理组件
 */
import React, { Fragment, PureComponent } from "react";
import { connect } from "dva";
import {
  Card,
  Row,
  Input,
  Button,
  Form,
  Select,
  Col,
  Divider,
  message, Avatar, Modal, Dropdown, Icon, Menu
} from "antd";
import StandardTable from "@/components/StandardTable";
import Result from "@/components/Result";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import moment from "moment";
import styles from "./Users.less";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
/**
 * 用户管理页面，对违规用户进行封禁（删除）支持通过用户名查找用户
 */

/* eslint react/no-multi-comp:0 */
@connect(({ users,user, loading }) => ({
  users,
  currentUser:user.currentUser,
  loading: loading.models.users
}))
@Form.create()
class UsersManage extends PureComponent {


  state = {
    selectedRows: [],
    visible: false, // 控制模态框显示
    done: false,  // 模态框是否完成
    current: {}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  columns = [
    {
      title: "用户名",
      dataIndex: "nickname"
    },
    {
      title: "用户头像",
      dataIndex: "avatar",
      key: "avatar",
      render: val => <Avatar
        shape="square"
        size={64}
        src={val || "http://www.sucaijishi.com/uploadfile/2018/0508/20180508023754592.png"}
      />
    },
    {
      title: "性别",
      dataIndex: "gender",
      width: "100",
      render: val => val === "1" ? "男" : "女"
    },
    {
      title: "职业",
      dataIndex: "pro",
      render: val => val || "无"
    },
    {
      title: "手机号",
      dataIndex: "mobile"
    },
    {
      title: "权限",
      dataIndex: "auth"
    },
    {
      title: "共发布帖子数",
      dataIndex: "posts_count",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.posts_count - b.posts_count
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      sorter: true,
      render: val => <span>{moment.unix(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.hanldeDeleteUserClik(record)}>删除</a>
          <Divider type="vertical" />
          {this.MoreBtn(record)}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "users/featchAllUsers",
      payload: {}
    });
  }


  /**
   * 模态框点击知道了
   */
  handleDone = () => {
    this.setState({
      done: false,
      visible: false
    });
  };

  /**
   * 展示填写联系内容模态框
   * @param item
   */
  showContactModal = item => {
    const {currentUser:{id}} = this.props;
    if (item.id !== id) {
      this.setState({
        visible: true,
        current: item
      });
    } else {
      message.warn("不要联系你自己呀,哈哈");
    }
  };

  /**
   * 模态框点击取消
   */
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  /**
   * 提交联系模态框
   * @param e
   */
  handleConcatUserSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const content = fieldsValue.concatContent;
      console.log(fieldsValue);
      dispatch({
        type: "users/fetchCreateMessage",
        payload: { content, tuid: current.id }
      });
      this.setState({
        done: true
      });
    });
  };


  MoreBtn = record => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => this.moreAndUser(key, record)}>
          <Menu.Item key="contact">联系该用户</Menu.Item>
          <Menu.Item key="set">设置其为管理员</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <Icon type="down" />
      </a>
    </Dropdown>
  );

  moreAndUser = (key, currentItem) => {
    if (key === "contact") this.showContactModal(currentItem);
    else if (key === "set") {
      Modal.confirm({
        title: "设置管理员",
        content: "你确定要设置该用户为管理员吗",
        okText: "确认",
        cancelText: "取消",
        onOk: () => this.handleSetUserAuth(currentItem)
      });
    }
  };


  /**
   * 删除用户
   * @param record
   */
  handleDeleteUser = (record) => {
    console.log(record);
    const { dispatch } = this.props;
    dispatch({
      type: "users/deleteUser",
      payload: { id: record.id }
    });
    dispatch({
      type: "users/featchAllUsers",
      payload: {}
    });
    message.success("删除成功");
  };

  hanldeDeleteUserClik = (record) => {
    Modal.confirm({
      title: "删除用户",
      content: "确定删除该用户吗",
      okText: "确认",
      cancelText: "取消",
      onOk: () => this.handleDeleteUser(record)
    });
  };

  handleSetUserAuth = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "users/setUserAuth",
      payload: { id: record.id }
    });
    dispatch({
      type: "users/featchAllUsers",
      payload: {}
    });
    message.success("设置权限成功");
  };

  /**
   * 重置表单值表单
   */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: "users/featchAllUsers",
      payload: {}
    });
  };

  /**
   * 提交查询表单
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      console.log(fieldsValue);
      this.setState({
        formValues: values
      });
      dispatch({
        type: "users/featchAllUsers",
        payload: values
      });
    });
  };

  /**
   * 渲染查询表单
   * @returns {*}
   */
  renderUserQueryForm = () => {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator("nickname")(<Input placeholder="请输入用户昵称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="选择性别">
              {getFieldDecorator("gender")(
                <Select placeholder="请选择性别" style={{ width: "100%" }}>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="选择用户类型">
              {getFieldDecorator("auth")(
                <Select placeholder="请选择用户类型" style={{ width: "100%" }}>
                  <Option value="1">普通用户</Option>
                  <Option value="2">管理员</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };


  // 全选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };


  /**
   * 批量删除用户
   * @param rows
   */
  handlebatchDeleteClick = rows => {
    Modal.confirm({
      title: "删除用户",
      content: `确定要批量删除${rows[0].nickname}、${rows[1].nickname}等用户吗?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        const idTuple = [];
        rows.forEach(item => idTuple.push(item.id));
        const { dispatch } = this.props;
        const values = {
          idTuple
        };
        dispatch({
          type: "users/batchDeleteUsers",
          payload: values
        });
        this.setState({
          selectedRows: []
        });
        dispatch({
          type: "users/featchAllUsers",
          payload: {}
        });
        message.success("删除用户成功");
      }
    });
  };


  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues
    };
    dispatch({
      type: "users/featchAllUsers",
      payload: params
    });
  };


  render() {
    const { selectedRows } = this.state;
    const { loading, users: { allUsers } } = this.props;
    const { list } = allUsers;
    const { visible, done, current } = this.state;
    const { form: { getFieldDecorator } } = this.props;

    /**
     * model 底部内容
     */
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: "发送", onOk: this.handleConcatUserSubmit, onCancel: this.handleCancel };


    /**
     * 模态框内容
     * @returns {*}
     */
    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="发送成功"
            description={`恭喜您，您向${current.nickname}发送了一条消息`}
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleConcatUserSubmit}>
          <FormItem {...this.formLayout} label="消息内容">
            {getFieldDecorator("concatContent", {
              rules: [{ message: "请输入至少五个字符的消息内容", min: 5, max: 50 }]
            })(<TextArea rows={3} placeholder="请输入消息内容" />)}
          </FormItem>
        </Form>
      );
    };


    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderUserQueryForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handlebatchDeleteClick(selectedRows)}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              data={allUsers}
              columns={this.columns}
              loading={loading}
              rowKey={list => list.id}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>


        <Modal
          title={done ? null : <div><Icon type="smile" /> 联系{current.nickname}</div>}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: "72px 0" } : { padding: "28px 0 0" }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );


  }

}

export default UsersManage;
