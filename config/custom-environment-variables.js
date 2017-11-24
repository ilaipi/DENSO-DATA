module.exports = {
  sequelize: {
    username: 'DB_USER',
    password: 'DB_PWD',
    database: 'DB_DB',
    host: 'DB_HOST',
    dialect: 'DB_DIALECT'
  },
  mail: {
    from: 'MAIL_FROM', // "Fred Foo 👻" <foo@blurdybloop.com>
    pass: 'MAIL_FROM_PASS',
    to: 'MAIL_TO', // bar@blurdybloop.com, baz@blurdybloop.com
    bcc: 'MAIN_BCC'
  }
};