import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function App() {

  const [studentList, setStudentList] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    full_name: '',
    gender: '',
    school: ''
  });
  const [query, setQuery] = useState("");

  async function getStudentListApi(){
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/students/?query=`+query;
      const response = await axios.get(apiUrl);
      const result = response.data;
      setStudentList(result);
    } catch (error) {
    }
  }
  async function updateStudentApi(){
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/students/update/${selectedUser.id}`;
      const response = await axios.put(apiUrl, selectedUser);
      const result = response.data;
      getStudentListApi();
      setShowEditModal(false);
    } catch (error) {
    }
  }
  async function createStudentApi(){
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/students/create`;
      const response = await axios.post(apiUrl, selectedUser);
      const result = response.data;
      getStudentListApi();
      setShowEditModal(false);
    } catch (error) {
    }
  }
  async function removeStudentApi(){
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/students/delete/${selectedUser.id}`;
      const response = await axios.delete(apiUrl);
      const result = response.data;
      getStudentListApi();
      setShowRemoveModal(false);
    } catch (error) {
    }
  }

  useEffect(() => {
    getStudentListApi();
  }, [])

  function handleOpenEditModal(selectedUser = {}){
    setSelectedUser(selectedUser);
    setShowEditModal(true);
  }

  function handleOpenDetailModal(selectedUser = {}){
    setSelectedUser(selectedUser);
    setShowDetailModal(true);
  }

  function handleOpenRemoveModal(selectedUser = {}){
    setSelectedUser(selectedUser);
    setShowRemoveModal(true);
  }

  function handleSave(){
    if(selectedUser.id){
      updateStudentApi();
    } else {
      createStudentApi();
    }
  }

  function handleConfirmRemoveStudent(){
    removeStudentApi();
  }

  function getRemoveModalTemplate(){
    return (
      <>
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa sinh viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>Chắc chắn muốn xóa sinh viên {selectedUser.full_name}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={() => handleConfirmRemoveStudent()}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    )
  }
  function getDetailModalTemplate(){
    return (
      <div>
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{"Thông tin"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
            <div className="form-group">
              Họ và tên: {selectedUser.full_name}
            </div>
              <div className="form-group">
                Giới tính: {selectedUser.gender}
              </div>
              <div className="form-group">
                Trường: {selectedUser.school}
              </div>
              <div className="form-group">
                Email: {selectedUser.email}
              </div>
              <div className="form-group">
                  Số điện thoại: {selectedUser.phone}
              </div>
              <div className="form-group">
                  Quốc gia: {selectedUser.country}
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
  function getEditModalTemplate(){
    return (
      <div>
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser?.id ? "Cập nhật thông tin" : "Thêm sinh viên"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="fullName" >Họ và tên:</label> 
              <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              value={selectedUser.full_name}
              onChange={(event) => setSelectedUser({...selectedUser, full_name: event.target.value})}
            />
            </div>
              <div className="form-group">
                  <label>Giới tính:</label>
                  <div>
                      <div className="form-check form-check-inline">
                          <input
                              type="radio"
                              className="form-check-input"
                              id="male"
                              name="gender"
                              value="Nam"
                              checked={selectedUser.gender === 'Nam'}
                              onChange={(event) => setSelectedUser({...selectedUser, gender: event.target.value})}
                          />
                          <label className="form-check-label" htmlFor="male">Nam</label>
                      </div>
                      <div className="form-check form-check-inline">
                          <input
                              type="radio"
                              className="form-check-input"
                              id="female"
                              name="gender"
                              value="Nữ"
                              checked={selectedUser.gender === 'Nữ'}
                              onChange={(event) => setSelectedUser({...selectedUser, gender: event.target.value})}
                          />
                          <label className="form-check-label" htmlFor="female">Nữ</label>
                      </div>
                  </div>
              </div>
              <div className="form-group">
                  <label htmlFor="school">Trường:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="school"
                      name="school"
                      value={selectedUser.school}
                      onChange={(event) => setSelectedUser({...selectedUser, school: event.target.value})}
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="school">Email:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={selectedUser.email}
                      onChange={(event) => setSelectedUser({...selectedUser, email: event.target.value})}
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="school">Số điện thoại:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={selectedUser.phone}
                      onChange={(event) => setSelectedUser({...selectedUser, phone: event.target.value})}
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="school">Quốc gia:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={selectedUser.country}
                      onChange={(event) => setSelectedUser({...selectedUser, country: event.target.value})}
                  />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleSave()}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  function getStudentListTemplate(){
    return studentList.map((student, index) => {
      return (
        <tr>
          <th scope="row">{index+1}</th>
          <td>{student.full_name}</td>
          <td>{student.gender}</td>
          <td>{student.school}</td>
          <th scope="col">
            <button className='btn btn-info' onClick={() => handleOpenDetailModal(student)}>Detail</button>
            <button className='btn btn-primary' style={{marginLeft: '4px'}} onClick={() => handleOpenEditModal(student)}>Update</button>
            <button className='btn btn-danger' style={{marginLeft: '4px'}} onClick={() => handleOpenRemoveModal(student)}>Remove</button>
          </th>
        </tr>
      )
    })
  }
  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Hello</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home menu<span class="sr-only">(current)</span></a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input id="student-query" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(event) => setQuery(event.target.value)} value={query}/>
            <button id="student-search-btn" class="btn btn-outline-success my-2 my-sm-0" type="button" onClick={() => getStudentListApi()}>Search</button>
          </form>
        </div>
      </nav>
      
      <div className="container" style={{marginTop: '50px'}}>
      <button type="button" class="btn btn-success" onClick={() => handleOpenEditModal()} >Thêm sinh viên</button>

      <div className="student-list-wrapper" style={{marginTop: '30px'}}>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Họ và tên</th>
              <th scope="col">Giới tính</th>
              <th scope="col">Trường</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {getStudentListTemplate()}
          </tbody>
        </table>
      </div>
      </div>
      {getDetailModalTemplate()}
      {getEditModalTemplate()}
      {getRemoveModalTemplate()}
    </div>
  );
}

export default App;
