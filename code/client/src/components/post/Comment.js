import React, { Component } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import EditCommentModal from './EditCommentModal';
import host from '../../host-config';
import {deleteComment} from '../../modules/post';

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    margin-left: 10px;
    margin-top: 10px;
    .avt {
        .avatar {
            border-radius: 50%;
            max-height: 50px;
            max-width: 50px;
        }
    }
    .stack {
        text-align: left;
        margin-left: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        .userinfo {
            display: flex;
            flex-direction: row;
        }
        .actions {
            display: flex;
            flex-direction: row;
        }
    }
`;

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {modalOpen : false};
    }
    handleSelect = (eventKey) => {
        if (eventKey === "e") {
            this.setState({modalOpen: true});
        } else {
            deleteComment(this.props.data._id);
            this.props.localRemoveComment(this.props.idx);
        }
    }

    render() {
        return (
            <Container>
                <div className="avt">
                    <img className='avatar' src={this.props.data.owner.profilePic? host + this.props.data.owner.profilePic: 'https://via.placeholder.com/50x50'} />
                </div>
                <div className="stack">
                    <div className='userinfo'>
                        <div><b>{this.props.data.owner.displayName}</b></div>
                        <div>@{this.props.data.owner.handle}</div>
                    </div>
                    <div>{this.props.data.content}</div>
                    {this.props.currId === this.props.data.owner._id && <DropdownButton
                        size="sm"
                        variant="secondary"
                        title="Edit"
                        onSelect={this.handleSelect}
                    >
                        <Dropdown.Item eventKey="e">Edit</Dropdown.Item>
                        <Dropdown.Item eventKey="d">Delete</Dropdown.Item>
                    </DropdownButton>}
                </div>
                <Modal show={this.state.modalOpen} onHide={()=> this.setState({modalOpen: false})}>
                    <EditCommentModal cmid={this.props.data._id} refreshPage={this.props.refreshPage} closeModal={()=> this.setState({modalOpen: false})}/>
                </Modal>
            </Container>
        );
    }
}