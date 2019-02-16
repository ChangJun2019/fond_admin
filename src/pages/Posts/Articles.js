/**
 * @Time: 2018/12/23 14:22
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc:  文章管理组件
 */
import React, { Fragment, PureComponent } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import router from "umi/router";
import {
  Card,
  Row,
  Input,
  Button,
  Form,
  Select,
  Col,
  Divider,
  Cascader,
  Avatar,
  message, Icon, Dropdown, Menu, Modal
} from "antd";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import StandardTable from "@/components/StandardTable";
import Highlighter from "react-highlight-words";
import Result from "@/components/Result";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import moment from "moment";
import styles from "./Posts.less";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
/**
 * 文章管理页面，可对文章进行管理。
 */

/* eslint react/no-multi-comp:0 */
@connect(({ posts, loading }) => ({
  allArticles: posts.allArticles,
  allTopics: posts.all_topics,
  loading: loading.models.posts
}))
@Form.create()
class ArticlesManage extends PureComponent {

  state = {
    selectedRows: [],  // 多选行
    expandForm: false,
    formValues: {},
    visible: false, // 控制模态框显示
    done: false,  // 模态框是否完成
    isConatUserModel: false,
    current: {}
  };


  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };


  columns = [
    {
      title: "文章标题",
      dataIndex: "titile",
      width: 100,
      key: "titile",
      fixed: "left",
      render: val => this.titleHighlight(val)
    },
    {
      title: "文章封面",
      dataIndex: "cover",
      fixed: "left",
      key: "cover",
      render: val => <Avatar shape="square" size={64} src={val}/>
    },
    {
      key: "atype",
      title: "文章类型",
      dataIndex: "atype",
      width: "140",
      align: "center",
      render: val => {
        if (val === 1) return "原创";
        if (val === 2) return "转载";
        if (val === 3) return "翻译";
      }
    },
    {
      key: "from_topic",
      title: "所属主题",
      dataIndex: "from_topic",
      align: "center",
      render: val => (
        <Fragment>
          <Avatar shape="square" icon="user" src={val.cover}/>
          <br/>
          {val.topics_name}
        </Fragment>
      )
    },
    {
      key: "created_user",
      title: "作者",
      dataIndex: "created_user",
      align: "center",
      render: val => (
        <Fragment>
          <Avatar shape="square" icon="user" src={val.user_avatar}/>
          <br/>
          {val.user_name}
        </Fragment>
      )
    },
    {
      key: "good",
      title: "是否精品",
      dataIndex: "good",
      align: "center",
      render: val => val === 0 ? "普通" : "精品"
    },
    {
      key: "top",
      title: "是否首位推荐",
      dataIndex: "top",
      align: "center",
      render: val => val === 0 ? "不推荐" : "推荐"
    },
    {
      key: "desc",
      title: "简介",
      dataIndex: "desc",
      width: "28%",
      render: val => this.descHighlight(val)
    },
    {
      key: "collects_count",
      title: "收藏数",
      dataIndex: "collects_count",
      align: "center"
    },
    {
      key: "like_count",
      title: "点赞数",
      dataIndex: "like_count",
      align: "center"
    },
    {
      key: "reply_count",
      title: "回复数",
      dataIndex: "reply_count",
      align: "center"
    },
    {
      key: "visit_count",
      title: "浏览量",
      dataIndex: "visit_count",
      align: "center"
    },
    {
      key: "update_time",
      title: "更新时间",
      dataIndex: "update_time",
      sorter: true,
      render: val => <span>{moment.unix(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      key: "action",
      title: "操作",
      fixed: "right",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDeleteArticles(record)}>删除</a>
          <Divider type="vertical"/>
          {this.MoreBtn(record)}
        </Fragment>
      )
    }
  ];


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "posts/fetchAllArticles",
      payload: {}
    });
  }


  MoreBtn = record => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => this.moreAndArticles(key, record)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="contact">联系该用户</Menu.Item>
          <Menu.Item key="good">{record.good === 1 ? "取消精品" : "加入精品"}</Menu.Item>
          <Menu.Item key="top">{record.top === 1 ? "取消推荐" : "加入推荐"}</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <Icon type="down"/>
      </a>
    </Dropdown>
  );

  /**
   * 更多操作
   * @param key
   * @param currentItem
   */
  moreAndArticles = (key, currentItem) => {
    this.setState({
      current: currentItem
    });
    if (key === "contact") this.showContactModal(currentItem);
    else if (key === "edit") {
      this.showEditModal(currentItem);
      const { form } = this.props;
      form.setFieldsValue({
        changeContent: BraftEditor.createEditorState(currentItem.content)
      });
    } else if (key === "good") {
      this.changeArticlesGood(currentItem);
    } else {
      this.changeArticlesTop(currentItem);
    }
  };

  /**
   * 设置文章精品状态
   * @param item
   */
  changeArticlesGood = item => {
    const { dispatch } = this.props;
    dispatch({
      type: "posts/changeArticlesGood",
      payload: { id: item.id ,type:1}
    });
    if (item.good === 1) {
      message.success("取消精品成功");
    } else {
      message.success("加入精品成功");
    }
  };

  changeArticlesTop = item => {
    const { dispatch } = this.props;
    dispatch({
      type: "posts/changeArticlesTop",
      payload: { id: item.id, type:1}
    });
    if (item.top === 1) {
      message.success("取消推荐成功");
    } else {
      message.success("推荐成功");
    }
  };

  /**
   * 显示联系作者模态框
   * @param currentItem
   */
  showContactModal = (currentItem) => {
    this.setState({
      visible: true, // 控制模态框显示
      done: false,
      isConatUserModel: true
    });
  };

  /**
   * 显示编辑文章模态框
   */
  showEditModal = (currentItem) => {
    this.setState({
      visible: true, // 控制模态框显示
      done: false,
      isConatUserModel: false
    });
  };


  /**
   * 删除文章
   * @param record
   */
  handleDeleteArticles = (record) => {

    Modal.confirm({
      title: "删除文章",
      content: <div>你确定删除<a>{record.titile}</a>这篇文章吗?</div>,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        console.log(record);
        const { dispatch } = this.props;
        dispatch({
          type: "posts/deletePosts",
          payload: { id: record.id ,type:1}
        });
        message.success("删除文章成功");
        dispatch({
          type: "posts/fetchAllArticles",
          payload: {}
        });
      }
    });
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
      type: "posts/fetchAllArticles",
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
      values.tid = fieldsValue.tid ? fieldsValue.tid[1] : undefined;
      console.log(values);
      this.setState({
        formValues: values
      });
      dispatch({
        type: "posts/fetchAllArticles",
        payload: values
      });
    });
  };

  /**
   * 渲染查询表单
   * @returns {*}
   */
  renderUserQueryForm = () => {
    const { form: { getFieldDecorator }, allTopics } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="文章标题">
              {getFieldDecorator("title")(<Input placeholder="请输入文章标题"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="文章类型">
              {getFieldDecorator("atype")(
                <Select placeholder="请选择文章类型" style={{ width: "100%" }}>
                  <Option value="1">原创</Option>
                  <Option value="2">转载</Option>
                  <Option value="3">翻译</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属主题">
              {getFieldDecorator("tid")(
                <Cascader options={allTopics} placeholder="所属主题"/>
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };


  /**
   * 渲染更多查询条件form表单
   * @returns {*}
   */
  renderQueryFormMore = () => {
    const { form: { getFieldDecorator }, allTopics } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="文章标题">
              {getFieldDecorator("title")(<Input placeholder="请输入文章标题"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="文章类型">
              {getFieldDecorator("atype")(
                <Select placeholder="请选择文章类型" style={{ width: "100%" }}>
                  <Option value="1">原创</Option>
                  <Option value="2">转载</Option>
                  <Option value="3">翻译</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属主题">
              {getFieldDecorator("tid")(
                <Cascader options={allTopics} placeholder="所属主题"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否是精品">
              {getFieldDecorator("good")(
                <Select placeholder="选择是否是精品" style={{ width: "100%" }}>
                  <Option value="0">普通</Option>
                  <Option value="1">精品</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="选择是否推荐">
              {getFieldDecorator("top")(
                <Select placeholder="选择是否推荐" style={{ width: "100%" }}>
                  <Option value="0">不推荐</Option>
                  <Option value="1">推荐</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="文章简介">
              {getFieldDecorator("desc")(
                <TextArea rows={3}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </div>
        </div>

      </Form>
    );
  };

  /**
   * 控制展开还是收起更多查询form
   */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm
    });
  };

  // 全选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };


  /**
   * 批量删除文章
   * @param rows
   */
  handlebatchDeleteClick = rows => {
    Modal.confirm({
      title: "批量删除文章",
      content: <div>你确定要删除 <a>{rows[0].titile}</a> 等文章吗？</div>,
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
          type: "posts/batchDeletePosts",
          payload: values
        });
        this.setState({
          selectedRows: []
        });
        message.success("批量删除文章成功");
        dispatch({
          type: "posts/fetchAllArticles",
          payload: {}
        });

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
      type: "posts/fetchAllArticles",
      payload: params
    });
  };


  handleToPostsSend = () => {
    router.push("/posttopics/postarticles");
  };

  /**
   * 标题模糊查询本文高亮
   * @param val
   * @returns {*}
   */
  titleHighlight(val) {
    const { formValues: { title } } = this.state;
    if (title) {
      return (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[title]}
          autoEscape
          textToHighlight={val}
        />
      );
    }
    return `${val}`;
  };

  /**
   * 模态框点击取消
   */
  handleCancel = () => {
    this.setState({
      visible: false,
      isConatUserModel: false
    });
  };

  /**
   * 简介模糊查询文本高亮
   * @param val
   * @returns {*}
   */
  descHighlight(val) {
    const { formValues: { desc } } = this.state;
    if (desc) {
      return (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[desc]}
          autoEscape
          textToHighlight={val}
        />
      );
    }
    return `${val}`;
  };

  // 查询条件渲染普通表单还是复杂表单
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderQueryFormMore() : this.renderUserQueryForm();
  }

  /**
   * 提交编辑文章表单
   * @param e
   */
  handleChangeArticles = (e) => {
    const { dispatch, form } = this.props;
    const { current } = this.state;
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = {
        id: current.id,
        title: fieldsValue.changeTitle,
        desc: fieldsValue.changeDesc,
        content: fieldsValue.changeContent.toHTML()
      };
      dispatch({
        type: "posts/changeArticles",
        payload: { ...data }
      });
      this.setState({
        visible: false,
        isConatUserModel: false
      });
      message.success(`修改${current.titile}文章成功`);
      dispatch({
        type: "posts/fetchAllArticles",
        payload: {}
      });
    });
  };

  /**
   * 向作者发送消息
   * @param e
   */
  handleConcatUserSubmit = e => {
    const { dispatch, form } = this.props;
    const { current } = this.state;
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const content = fieldsValue.concatContent;
      dispatch({
        type: "users/fetchCreateMessage",
        payload: { content, tuid: current.created_user.user_id }
      });
      this.setState({
        done: true
      });
    });
  };

  /**
   * 模态框点击知道了
   */
  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
      isConatUserModel: false
    });
  };

  render() {
    const { selectedRows } = this.state;
    const { loading, allArticles } = this.props;
    const { list } = allArticles;
    const { done, visible, isConatUserModel, current } = this.state;
    const { form: { getFieldDecorator } } = this.props;


    const formChangeItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 15 }
      }
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };
    /**
     * model 底部内容
     */

    let modalFooter = { okText: "修改", onOk: this.handleChangeArticles, onCancel: this.handleCancel };
    if (isConatUserModel) {
      modalFooter = { okText: "发送", onOk: this.handleConcatUserSubmit, onCancel: this.handleCancel };
    }
    if (done) {
      modalFooter = { footer: null, onCancel: this.handleDone };
    }


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
            description={`恭喜您，您向${current.created_user.user_name}发送了一条消息`}
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      if (isConatUserModel) {
        return (
          <Form onSubmit={this.handleConcatUserSubmit}>
            <FormItem {...this.formLayout} label="消息内容">
              {getFieldDecorator("concatContent", {
                rules: [{ message: "请输入至少五个字符的消息内容", min: 5, max: 50 }]
              })(<TextArea rows={3} placeholder="请输入消息内容"/>)}
            </FormItem>
          </Form>
        );
      }
      return (
        <Form onSubmit={this.handleChangeArticles} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formChangeItemLayout} label={<FormattedMessage id="form.title.label"/>}>
            {getFieldDecorator("changeTitle", {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: "validation.title.required" })
                }
              ],
              initialValue: current.titile
            })(<Input placeholder={formatMessage({ id: "form.title.placeholder" })}/>)}
          </FormItem>
          <FormItem {...formChangeItemLayout} label={<FormattedMessage id="form.state.label"/>}>
            {getFieldDecorator("changeDesc", {
              rules: [
                {
                  required: true,
                  max: 150,
                  message: formatMessage({ id: "validation.state.content.required" })
                }
              ],
              initialValue: current.desc
            })(
              <TextArea rows={4} placeholder={formatMessage({ id: "form.state.content.placeholder" })}/>
            )}
          </FormItem>
          <FormItem
            {...formChangeItemLayout}
            label={<FormattedMessage id="form.article.label.content"/>}
          >
            {getFieldDecorator("changeContent", {
              validateTrigger: "onBlur",
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback("请输入正文内容");
                  } else {
                    callback();
                  }
                }
              }]
            })(
              <BraftEditor
                className={styles.myEditor}
                placeholder="请输入正文内容"
              />
            )}
          </FormItem>
        </Form>
      );
    };


    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em/>}
      </div>
    );

    const extraContent = (
      <div className={styles.standardList}>
        <Row>
          <Col sm={8} xs={24}>
            <Info title="文章总数" value="50篇文章" bordered/>
          </Col>
          <Col sm={8} xs={24}>
            <Info title="共有多少人发布文章" value="18人" bordered/>
          </Col>
          <Col sm={8} xs={24}>
            <Info title="本周创建文章总数" value="48篇文章"/>
          </Col>
        </Row>
      </div>
    );

    return (
      <PageHeaderWrapper title="文章管理" content={extraContent}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleToPostsSend()}>
                发布文章
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handlebatchDeleteClick(selectedRows)}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              data={allArticles}
              columns={this.columns}
              loading={loading}
              rowKey={list => list.id}
              onSelectRow={this.handleSelectRows}
              scroll={{ x: 2000 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <Modal
          title={done ? null : (isConatUserModel ? <div><Icon type="smile"/> 发送消息</div> :
            <div><Icon type="smile"/> 修改文章</div>)}
          className={styles.standardListForm}
          width={720}
          bodyStyle={done ? { padding: "72px 0" } : { padding: "28px 0 0" }}
          destroyOnClose={false}
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );


  }

}

export default ArticlesManage;
