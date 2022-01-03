import {Meteor} from "meteor/meteor";

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function graphsPublication() {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      // Prevent access to usersList if the user is not admin
      throw new Meteor.Error('not-authorized');
    }

    return Meteor.users.find({});
  });
}

Meteor.methods({
  'users.create' (user) {
    try {
      let userId = Accounts.createUser(user);
      if (userId) {
        // set first user as admin and all others as guest
        // admin can update other user's roles
        let roles;
        let usersCount = Meteor.users.find().count();
        if (usersCount === 1) {
          roles = ['superuser', 'admin', 'researcher'];
        } else {
          roles = ['guest'];
        }
        Roles.addUsersToRoles(userId, roles);
      }
    } catch (err) {
      return err;
    }
  },
  'users.fetch' () {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      // Prevent access to users if the user is not admin
      throw new Meteor.Error('not-authorized');
    }

    return Meteor.users.find().fetch();
  },
  'users.handleRoles' (userId, roles) {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      // Prevent access to users if the user is not admin
      throw new Meteor.Error('not-authorized');
    }

    const prevRoles = Roles.getRolesForUser(userId);
    if (prevRoles.length > roles.length) {
      // remove role
      const diff = prevRoles.filter(function(i) {
        return roles.indexOf(i) < 0;
      });
      Roles.removeUsersFromRoles(userId, diff);
      if (roles.length === 0) {
        // by default, user is set to guest
        Roles.addUsersToRoles(userId, 'guest');
      }
    } else {
      // add to role
      Roles.addUsersToRoles(userId, roles);
    }
  },
  'users.remove' (userId) {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      // Prevent access to users if the user is not admin
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.remove(userId);
  }
});
