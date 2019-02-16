/**
 * @Time: 2019/1/6 23:32
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc: 动态管理
 */

import React, { PureComponent } from "react";
import { connect } from "dva";
import {
  Card,
  Row,
  Input,
  Button,
  Form,
  Select,
  Col,
  Cascader,
  Icon, Dropdown, Menu, Carousel, List, Tag, Modal, message
} from "antd";
import Highlighter from "react-highlight-words";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import moment from "moment";
import BraftEditor from "braft-editor";
import stylesProjects from "./Projects.less";
import styles from "./Posts.less";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 动态管理页面，可对文章进行管理。
 */

/* eslint react/no-multi-comp:0 */
@connect(({ posts, loading }) => ({
  allStates: posts.allStates,
  allTopics: posts.all_topics,
  loading: loading.models.posts
}))
@Form.create()
class StatesManage extends PureComponent {

  state = {
    expandForm: false,
    formValues: {}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "posts/fetchAllStates",
      payload: {}
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
      type: "posts/fetchAllStates",
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
        type: "posts/fetchAllStates",
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
            <FormItem label="动态标题">
              {getFieldDecorator("title")(<Input placeholder="请输入文章标题" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属主题">
              {getFieldDecorator("tid")(
                <Cascader options={allTopics} placeholder="所属主题" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否是精品">
              {getFieldDecorator("good")(
                <Select placeholder="选择是否是精品" style={{ width: "100%" }}>
                  <Option value="0">普通</Option>
                  <Option value="1">精品</Option>
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
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
          <Col md={6} sm={24}>
            <FormItem label="动态标题">
              {getFieldDecorator("title")(<Input placeholder="请输入文章标题" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属主题">
              {getFieldDecorator("tid")(
                <Cascader options={allTopics} placeholder="所属主题" />
              )}
            </FormItem>
          </Col>
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
            <FormItem label="内容简介">
              {getFieldDecorator("content")(
                <TextArea rows={3} />
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
              收起 <Icon type="up" />
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
   * 简介模糊查询文本高亮
   * @param val
   * @returns {*}
   */
  contentHighlight(val) {
    const { formValues: { content } } = this.state;
    if (content) {
      return (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[content]}
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
  };


  render() {

    const { loading, allStates } = this.props;
    const { list, pagination } = allStates;
    console.log(this.props);


    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.standardList}>
        <Row>
          <Col sm={8} xs={24}>
            <Info title="动态总数" value="50个动态" bordered />
          </Col>
          <Col sm={8} xs={24}>
            <Info title="共有多少人发布动态" value="18个动态" bordered />
          </Col>
          <Col sm={8} xs={24}>
            <Info title="本周创建动态总数" value="48个动态" />
          </Col>
        </Row>
      </div>
    );

    const getImagesContent = (item) => (
      <Carousel effect="fade" autoplay>{
        item.map((item, index) => (
          <img key={index} height={270} src={item} alt="" />
        ))
      }
      </Carousel>);

    /**
     * 删除动态
     * @param item
     */
    const handleStatesDelete = item => {
      Modal.confirm({
        title: "删除动态",
        content: <div>你确定删除<a>{item.titile}</a>这篇动态吗?</div>,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          console.log(item);
          const { dispatch } = this.props;
          dispatch({
            type: "posts/deletePosts",
            payload: { id: item.id ,type:2}
          });
          dispatch({
            type: "posts/fetchAllStates",
            payload: {}
          });
          message.success("删除动态成功");
        }
      });
    };

    /**
     * 改变精品
     * @param item
     */
    const handleStatesGood = item => {
      const { dispatch } = this.props;
      dispatch({
        type: "posts/changeArticlesGood",
        payload: { id: item.id ,type:2}
      });
      if (item.good === 1) {
        message.success("取消精品成功");
      } else {
        message.success("加入精品成功");
      }
    };

    /**
     * 改变是否推荐
     * @param item
     */
    const handeleStatesTop = item => {
      const { dispatch } = this.props;
      dispatch({
        type: "posts/changeArticlesTop",
        payload: { id: item.id, type:2 }
      });
      if (item.top === 1) {
        message.success("取消推荐成功");
      } else {
        message.success("推荐成功");
      }
    };

    const moreAndStates = (key, currentItem) => {
      if (key === "delete") {
        handleStatesDelete(currentItem);
      } else if (key === "good") {
        handleStatesGood(currentItem);
      } else {
        handeleStatesTop(currentItem);
      }
    };

    function MoreBtn({data}) {
      return (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => moreAndStates(key, data)}>
              <Menu.Item key="delete">删除</Menu.Item>
              <Menu.Item key="good">{data.good === 1 ? "取消精品" : "加入精品"}</Menu.Item>
              <Menu.Item key="top">{data.top === 1 ? "取消推荐" : "加入推荐"}</Menu.Item>
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    }

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );


    return (
      <PageHeaderWrapper title="动态管理" content={extraContent}>
        <Card bordered={false} style={{ "paddingBottom": "10px" }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <List
            className={stylesProjects.coverCardList}
            rowKey="id"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            pagination={pagination}
            loading={loading}
            renderItem={item => (
              <List.Item>
                <Card
                  className={stylesProjects.card}
                  hoverable
                  cover={getImagesContent(item.images)}
                  actions={[
                    <IconText type="star-o" text={item.visit_count} />,
                    <IconText type="like-o" text={item.like_count} />,
                    <IconText type="message" text={item.reply_count} />,
                    <MoreBtn data={item} />
                  ]}
                >
                  <Card.Meta
                    title={<a>{this.titleHighlight(item.titile)}</a>}
                    avatar={<img alt="" className={styles.cardAvatar} src={item.created_user.user_avatar} />}
                    description={this.contentHighlight(item.content)}
                  />
                  <div className={stylesProjects.cardItemContent}>
                    <Tag color="#2A2A2A">{item.good === 1 ? "精品" : "普通"}</Tag>
                    <Tag color="#2A2A2A">{item.top === 1 ? "推荐" : "不推荐"}</Tag>
                    <span>{moment.unix(item.update_time).fromNow()}</span>
                    <div className={stylesProjects.avatarList}>
                      by {item.from_topic.topics_name}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default StatesManage;


