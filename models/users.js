const bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    'User',
    {
      idUser: {
        type: DataTypes.INTEGER(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(32),
        allowNull: true
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
      },
      profPic: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'default.png'
      }
    },
    {
      tableName: 'users',
      timestamps: true
    }
  );
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.beforeCreate(user => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
