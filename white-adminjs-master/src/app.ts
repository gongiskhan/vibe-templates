import express from 'express';
import { buildAuthenticatedRouter } from '@adminjs/express';
import AdminJS, { ComponentLoader } from 'adminjs';
import mongoose from 'mongoose';
import { Database, Resource } from '@adminjs/mongoose';
import provider from './admin/auth-provider.js';
import { AppResources } from './models/index.js';

const port = process.env.PORT || 3000;

AdminJS.registerAdapter({ Database, Resource });

const componentLoader = new ComponentLoader()

const Components = {
  Dashboard: componentLoader.add('Dashboard', './dashboard'),
  // other custom components
}

const start = async () => {
  await mongoose.connect(process.env.DATABASE_URL as string);

  const app = express();

  const admin = new AdminJS({
    rootPath: '/admin',
    resources: AppResources,
    databases: [],
    componentLoader,
    dashboard: {
      component: Components.Dashboard,
    },
  });

  const router = buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: process.env.COOKIE_SECRET,
      cookieName: 'adminjs',
      provider,
    },
    null,
    {
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: true,
      resave: true,
    },
  );

  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
