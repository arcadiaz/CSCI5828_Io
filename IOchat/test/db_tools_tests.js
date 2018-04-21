const expect = require('chai').expect;
const db_tools = require('../db_tools');


describe('#establish_db_connection', () => {
    let p;
    it('should be able to establish db connection', async () => {
        p = await db_tools.establish_db_connection;
        expect(p).to.not.throw();
    });

});


describe('#insert message', () => {
    let conn;
    beforeEach ( () =>
        conn = db_tools.establish_db_connection()
    );
   it('should insert message succesfully', async () => {
        const p =  await db_tools.insert_msg(conn, "testing", "testUser1", "testChannel");
        expect(p).to.have.property('affectedRows');
        expect(p).property('affectedRows').to.equal(1);
        expect(p).property('serverStatus').to.equal(2);
   });
});

describe('#retrieve messages', () => {
   let conn;

   beforeEach( () =>
    conn = db_tools.establish_db_connection()
   );

   it('should get 0 messages for nonexistent user', async() => {
      const p = await db_tools.retrieve_msgs(conn, 5, "doesNotExistUser1", "testChannel1");
      expect(p).to.have.length(0);
   });

   it('should get 0 messages for nonexistent channel', async() => {
        const p = await db_tools.retrieve_msgs(conn, 5, "user1", "doesNotExistChannel1");
        expect(p).to.have.length(0);
    });

    it('should get inserted message', async() => {
        const username ="testUser" + Date.now();
        const channel = "testChannel1" + Date.now();
        const msg = "a test message";

        const p =  await db_tools.insert_msg(conn, msg, username, channel);
        const j = await db_tools.retrieve_msgs(conn, 1, username, channel);
        expect(j).to.have.length(1);
    });
});