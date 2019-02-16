export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['AdminScope', 'UserScope'],
    routes: [
      // dashboard
      { path: '/',  redirect: '/account/center'},
      {
        path: '/users',
        icon: 'team',
        name: 'users',
        routes: [
          {
            path: '/users/manage',
            name: 'manage',
            component: './Users/Users',
          },
        ],
      },
      {
        path: '/posts',
        icon: 'solution',
        name: 'posts',
        routes: [
          {
            path: '/posts/articles',
            name: 'articles',
            component: './Posts/Articles',
          },
          {
            path: '/posts/states',
            name: 'states',
            component: './Posts/States',
          },
          {
            path: '/posts/vstates',
            name: 'vstates',
            component: './Posts/VideoStates',
          },
        ],
      },
      {
        path: '/topics',
        icon: 'tag',
        name: 'topics',
        routes: [
          {
            path: '/topics/onesort',
            name: 'oneTopics',
            component: './Topics/OneSort',
          },
          {
            path: '/topics/towtopics',
            name: 'TowTopics',
            component: './Topics/TowTopics',
          },
        ],
      },
      {
        path: '/posttopics',
        icon: 'form',
        name: 'posttopics',
        routes: [
          {
            path: '/posttopics/postarticles',
            name: 'postarticles',
            component: './PostTopics/PostArticles',
          },
          {
            path: '/posttopics/poststates',
            name: 'poststates',
            component: './PostTopics/PostStates',
          },
          {
            path: '/posttopics/postvideos',
            name: 'postvideos',
            component: './PostTopics/PostVideos',
          }
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/UserArticles',
              },
              {
                path: '/account/center/states',
                component: './Account/Center/UserStates',
              },
              {
                path: '/account/center/vstates',
                component: './Account/Center/UserVideoStates',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
