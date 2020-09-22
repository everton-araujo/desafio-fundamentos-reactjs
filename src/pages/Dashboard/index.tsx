import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';
import { useRouteMatch } from 'react-router-dom';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionParams {
  transactions: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const { params } = useRouteMatch<TransactionParams>();

  useEffect(() => {
    api.get('/transactions').then(response => {
      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    });
  }, [params.transactions]);

  return (
    <>
      <Header />
      <Container>

        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formatValue(balance.outcome)}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>
            {transactions.map(transaction => (
              <tbody>
                <tr>
                  <td className="title" id={transaction.id}>{transaction.title}</td>
                  {transaction.type === 'income' ? (
                    <td className="income">{formatValue(transaction.value)}</td>
                  ) : (
                      <td className="outcome">-{formatValue(transaction.value)}</td>
                    )}
                  <td>{transaction.category.title}</td>
                  <td>{
                    String(transaction.created_at).substring(8, 10) + '/' +
                    String(transaction.created_at).substring(5, 7) + '/' +
                    String(transaction.created_at).substring(0, 4)
                  }</td>
                </tr>
              </tbody>
            ))}
          </table>
        </TableContainer>

      </Container>
    </>
  );
};

export default Dashboard;
