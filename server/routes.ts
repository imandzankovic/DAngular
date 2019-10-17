import * as express from 'express';

import CatCtrl from './controllers/cat';
import PresentationCtrl from './controllers/presentation';
import SlideCtrl from './controllers/slide';
import UserCtrl from './controllers/user';


export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const presentationCtrl = new PresentationCtrl();
  const slideCtrl = new SlideCtrl();

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  //presentation
  router.route('/presentation').post(presentationCtrl.insert);
  router.route('/presentation').get(presentationCtrl.getAll);
  router.route('/presentation/:id').get(presentationCtrl.get);
  router.route('/presentation/:id').put(presentationCtrl.update);
  router.route('/presentation/:id').delete(presentationCtrl.delete);

 //slide
 router.route('/slide').post(slideCtrl.insert);
 router.route('/slide').get(slideCtrl.getAll);
 router.route('/slide/:id').get(slideCtrl.get);
 router.route('/slide/:id').put(slideCtrl.update);
 router.route('/slide/:id').delete(slideCtrl.delete);


  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
