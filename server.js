let today = new Date();
let m = today.getMonth() + 1;
let d = today.getDate();
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '10mb' }));
var cors = require('cors');
const { profile } = require('console');
app.use(cors());
// app.use(express.urlencoded({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'whattodo/dist')));

app.get('/', function (요청, 응답) {
  응답.sendFile(path.join(__dirname, '/hattodo/dist/index.html'));
});
const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect(
  'mongodb+srv://kimdaeho5657:rlaeogh5657@cluster0.bxeux.mongodb.net/whattodo?retryWrites=true&w=majority',
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return console.log(에러);

    db = client.db('whattodo');
    app.listen('8080', function () {
      console.log('listening on 8080');
    });
    /////
    app.post('/MakeUserData', function (요청, 응답) {
      db.collection('user').insertOne(요청.body, function (에러, 결과) {
        console.log('저장완료');
      });
    });
    app.post('/MakeUserFirstProfile', function (요청, 응답) {
      db.collection('contents').insertOne(요청.body, function (에러, 결과) {
        console.log('저장완료');
      });
    });
    app.post('/Login', function (요청, 응답) {
      db.collection('user')
        .find({ _id: 요청.body._id })
        .toArray()
        .then(data => {
          if (data.length === 0) {
            응답.send('잘못됨');
            // 응답.send('off');
          } else if (
            요청.body._id == data[0]._id &&
            요청.body.pwd == data[0].pwd
          ) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          } else {
            응답.send('잘못됨');
          }
        });
    });
    app.post('/LoginBeforeUpdate', function (요청, 응답) {
      db.collection('contents').updateOne(
        {
          _id: 요청.body._id,
        },
        {
          $push: {
            'profile.0.contents': {
              month: m,
              day: d,
              alarmN: [],
            },
            'profile.1.contents': {
              month: m,
              day: d,
              alarmN: [],
            },
          },
        },
        function (에러, 결과) {
          db.collection('contents')
            .find({ _id: 요청.body._id })
            .toArray()
            .then(a => {
              응답.send(a);
            });
        }
      );
    });
    app.post('/BeforeUpdate', function (요청, 응답) {
      db.collection('contents').updateOne(
        {
          _id: 요청.body[0]._id,
        },
        {
          $push: {
            'profile.0.contents': {
              month: 요청.body[1].month,
              day: 요청.body[2].day,
              alarmN: [],
            },
            'profile.1.contents': {
              month: 요청.body[1].month,
              day: 요청.body[2].day,
              alarmN: [],
            },
          },
        },
        function (에러, 결과) {
          db.collection('contents')
            .find({ _id: 요청.body[0]._id })
            .toArray()
            .then(a => {
              응답.send(a);
            });
        }
      );
    });
    app.post('/ModalUpdate', function (요청, 응답) {
      if (요청.body.text[1] !== undefined && 요청.body.text[2] !== undefined) {
        console.log('내용있음');
      } else if (
        요청.body.text[1] !== undefined &&
        요청.body.text[2] === undefined
      ) {
        요청.body.text[2] = '';
      } else if (
        요청.body.text[2] !== undefined &&
        요청.body.text[1] === undefined
      ) {
        요청.body.text[1] = '';
      } else {
        요청.body.text[1] = '';
        요청.body.text[2] = '';
      }
      var obj1 = {};
      obj1[`profile.${요청.body.profileN}.contents.$.alarmN`] = {
        index: 요청.body.alarmindex,
        // index되면 alarmindex로 보내고 수정
        title: 요청.body.title,
        time: 요청.body.time,
        text: [요청.body.text[0], 요청.body.text[1], 요청.body.text[2]],
        ball: 0,
      };
      if (요청.body.profileN == 0) {
        db.collection('contents').updateMany(
          {
            _id: 요청.body._id,
            'profile.0.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $push: obj1,
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      } else {
        db.collection('contents').updateMany(
          {
            _id: 요청.body._id,
            'profile.1.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $push: obj1,
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      }
    });
    app.post('/DelModal', function (요청, 응답) {
      if (요청.body.profileN == 0) {
        db.collection('contents').updateOne(
          {
            _id: 요청.body._id,
            'profile.0.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $pull: {
              'profile.0.contents.$.alarmN': {
                index: 요청.body.alarmindex,
              },
            },
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      } else {
        db.collection('contents').updateOne(
          {
            _id: 요청.body._id,
            'profile.1.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $pull: {
              'profile.1.contents.$.alarmN': { index: 요청.body.alarmindex },
            },
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      }
    });
    app.post('/ModifyModal', function (요청, 응답) {
      if (요청.body.text[1] !== undefined && 요청.body.text[2] !== undefined) {
        console.log('내용있음');
      } else if (
        요청.body.text[1] !== undefined &&
        요청.body.text[2] === undefined
      ) {
        요청.body.text[2] = '';
      } else if (
        요청.body.text[2] !== undefined &&
        요청.body.text[1] === undefined
      ) {
        요청.body.text[1] = '';
      } else {
        요청.body.text[1] = '';
        요청.body.text[2] = '';
      }
      var obj1 = {};
      obj1[
        `profile.${요청.body.profileN}.contents.$.alarmN.${요청.body.alarmorder}`
      ] = {
        index: 요청.body.alarmindex,
        title: 요청.body.title,
        time: 요청.body.time,
        text: [요청.body.text[0], 요청.body.text[1], 요청.body.text[2]],
        ball: 요청.body.ball,
      };

      if (요청.body.profileN == 0) {
        db.collection('contents').updateOne(
          {
            _id: 요청.body._id,
            'profile.0.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $set: obj1,
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      } else if (요청.body.profileN == 1) {
        db.collection('contents').updateOne(
          {
            _id: 요청.body._id,
            'profile.1.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $set: obj1,
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      }
    });
    app.post('/BallUpdate', function (요청, 응답) {
      var obj1 = {};
      obj1[
        `profile.${요청.body.profileN}.contents.$.alarmN.${요청.body.alarmorder}.ball`
      ] = 요청.body.ball;

      if (요청.body.profileN == 0) {
        db.collection('contents').updateOne(
          {
            _id: 요청.body._id,
            'profile.0.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $set: obj1,
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      } else {
        db.collection('contents').updateOne(
          {
            _id: 요청.body._id,
            'profile.1.contents': {
              $elemMatch: {
                month: 요청.body.month,
                day: 요청.body.day,
              },
            },
          },
          {
            $set: obj1,
          },
          function (에러, 결과) {
            db.collection('contents')
              .find({ _id: 요청.body._id })
              .toArray()
              .then(a => {
                응답.send(a);
              });
          }
        );
      }
    });
  }
);

// app.get('/a', function (요청, 응답) {
//   db.collection('post')
//     .find()
//     .toArray(function (에러, 결과) {
//       응답.send(결과);
//     });
// });

// function (에러, 결과) {
//   db.collection('contents')
//     .find({ _id: 요청.body._id })
//     .toArray()
//     .then(a => {
//       응답.send(a);
//     });
// }
