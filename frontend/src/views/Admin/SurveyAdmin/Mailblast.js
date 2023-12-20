import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';

const FeedbackContainer = styled.div`
  max-width: 1000px;
  margin: auto 30px;

  .h-title {
    width: 1250px;
    border-bottom-style: solid;
    border-color: #D3D3D3;
    border-width: 0px 0px 3px 0px;
  }
  h1 {
    text-align: left;
    font-size: 24px;
    color: #000;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  table {
    width: 125%;
    border-collapse: collapse;
    margin-bottom: 20px;
    margin-top: 15px;
    border-left: 1px solid #ddd;
  }
  tr th {
    padding: 12px;
    text-align: center;
    background-color: #21ACD7;
    color: white;
  }
  
  
  th, td {
    padding: 12px;
    text-align: center;
    color: #000;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }

  .sendMailButton {
    display: block;
    margin-top: 10px; 
    margin-bottom: 20px; 
    padding: 10px 15px;
    background-color: #21ACD7;
    color: white;
    border: 2px solid #21ACD7;
    border-radius: 5px;
    cursor: pointer;
    margin-left: auto; 
    margin-right: 300px; 
    display: flex;
    align-items: center; 
    justify-content: center;
    outline:none;
  }
  
  .sendMailButton:hover {
    background-color: white;
    color: #21ACD7;
  }
  
  
  
`;

function Mailblast() {
  const [customers, setCustomers] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/customers');
        console.log('Customer Data:', response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchData();
  }, []);
 
  const handleSendBulkEmail = async () => {
    try {
      
      const subject = prompt('Enter email subject:');
      const message = prompt('Enter email message:');
  
 
      const response = await axios.post('http://localhost:8080/api/send-bulk-email', { subject, message });
      alert(response.data); 
    } catch (error) {
      console.error('Error sending bulk email:', error);
      alert('Failed to send bulk email'); 
    }
  };
  
  return (
    <FeedbackContainer>
      <div className='h-title'>
        <h1>Mail Blast</h1>
      </div>
      <table>
        <thead>
          <tr>
            {/*<th>ID</th>*/}
            <th>First Name</th>
            <th>Last Name</th>
            <th>Telephone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.telephone}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="sendMailButton"
        onClick={handleSendBulkEmail}
      >
        Send Email
      </button>

    </FeedbackContainer>
  );
}

export default withRouter(Mailblast)


