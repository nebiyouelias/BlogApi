const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("./server");


const expect = chai.expect;


chai.use(chaiHttp);

describe("BlogPosts", function() {
  
  before(function() {
    return runServer();
  });

  
  after(function() {
    return closeServer();
  });

 
  it("should list items on GET", function() {
    
    return chai
      .request(app)
      .get("/BlogPosts")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");

        
        expect(res.body.length).to.be.at.least(1);
        
       
        const expectedKeys = ['title', 'content', 'author','id'];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  
  it("should add an item on POST", function() {
    const newItem = { title:"Coffe", content:"loreum Ipsum", author:"Robin William", publishDate:"12-3-15"};
    return chai
      .request(app)
      .post("/BlogPosts")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("title", "content", "author", "publishDate");
        expect(res.body.id).to.not.equal(null);
        
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  
  
  it("should update items on PUT", function() {
    
    const updateData = {
      title:"Learn to Code",
      content:"Loreum Ipsum",
      author:"Yours Truly",
      publishDate:"2-1-3"
    };

    return (
      chai
        .request(app)
       
        .get("/BlogPosts")
        .then(function(res) {
          updateData.id = res.body[0].id;
          
          return chai
            .request(app)
            .put(`/BlogPosts/${updateData.id}`)
            .send(updateData);
        })
       
        .then(function(res) {
          expect(res).to.have.status(204);
          expect(res.body).to.be.a("object");
         
          console.log(res.body);
        })

    );
  });
  it("should delete items on DELETE", function() {
    return (
      chai
        .request(app)
       
        .get("/BlogPosts")
        .then(function(res) {
          return chai.request(app).delete(`/BlogPosts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});
