import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {Progress} from 'reactstrap';
import {Button, Alert} from 'react-bootstrap';
import host from '../../host-config';
const Container = styled.div`
margin-bottom: 10px;
.files input {
    outline: 2px dashed #92b0b3;
    outline-offset: -10px;
    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
    transition: outline-offset .15s ease-in-out, background-color .15s linear;
    padding: 120px 0px 85px 30px;
    text-align: center !important;
    margin: 0;
    width: 100% !important;
}
.files input:focus{     outline: 2px dashed #92b0b3;  outline-offset: -10px;
    -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
    transition: outline-offset .15s ease-in-out, background-color .15s linear; border:1px solid #92b0b3;
 }
.files{ position:relative}
.files:after {  pointer-events: none;
    position: absolute;
    top: 60px;
    left: 0;
    width: 50px;
    right: 0;
    height: 56px;
    content: "";
    background-image: url(https://image.flaticon.com/icons/png/128/109/109612.png);
    display: block;
    margin: 0 auto;
    background-size: 100%;
    background-repeat: no-repeat;
}
.color input{ background-color:#f1f1f1;}
.files:before {
    position: absolute;
    top: 10px;
    left: 0;  pointer-events: none;
    width: 100%;
    right: 0;
    height: 57px;
    content: "Upload new profile image.";
    display: block;
    margin: 0 auto;
    color: #2ea591;
    font-weight: 600;
    text-transform: capitalize;
    text-align: center;
}
`;

export default function AvatarUpload(props) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [loaded, setLoaded] = useState(null);
    const [alert, setAlert] = useState(null);
    const checkFileSize = (event) => {
        let files = event.target.files;
        let size = 100000; // 100K
        let err = "";
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type + ` is larger than ${size / 1000} KB, please pick a smaller image\n`;
            }
        };
        if (err !== '') {
            event.target.value = null;
            setAlert(err);
            return false;
        }
        return true;
    }
    const onChangeHandler = event => {
        if (checkFileSize(event)) {
            setSelectedImage(event.target.files[0]);
            setLoaded(0);
        }
    }

    const onClickHandler = () => {
        const data = new FormData();
        data.append('image', selectedImage);
        axios.post(`http://${host}/api/s3/avatar`, data, {
            onUploadProgress: ProgressEvent => {
                setLoaded(ProgressEvent.loaded / ProgressEvent.total*100)
          }
        })
        .then(res => {
            setAlert(null);
            props.setAvatar(res.data.imagePath);
        })
    }
    return (
        <Container>
            {alert && <Alert key="alert" variant="danger">${alert}</Alert>}
            <Button variant="danger" onClick={onClickHandler}
            style={{marginTop: '5px', marginBottom: '5px'}}
            >Upload Avatar</Button>
            <div className="row">
                <div className="col-md-12">
                    <form method="post" action="#" id="#">
                        <div className="form-group files color">
                            <input type="file" className="form-control" multiple=""
                                accept="image/*"
                                onChange={onChangeHandler} />
                        </div>
                        <Progress max="100" color="success" value={loaded} >{Math.round(loaded,2) }%</Progress>
                    </form>
                </div>
            </div>
        </Container>
    );
}