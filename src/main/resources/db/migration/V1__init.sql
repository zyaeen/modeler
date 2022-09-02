CREATE TABLE NODE
(
    node_Id   NUMBER PRIMARY KEY,
    id INTEGER NOT NULL UNIQUE ,
    label varchar2(50) NOT NULL UNIQUE
);
CREATE SEQUENCE sq_node_id START WITH 1 INCREMENT BY 1;

CREATE TABLE EDGE
(
    id            NUMBER PRIMARY KEY,
    From_Node INTEGER,
    To_Node INTEGER

);
CREATE SEQUENCE sq_edge_id START WITH 1 INCREMENT BY 1;


INSERT INTO NODE VALUES (next value for sq_node_id, 1, 'Node 1');
INSERT INTO NODE VALUES (next value for sq_node_id, 2, 'Node 2');
INSERT INTO NODE VALUES (next value for sq_node_id, 3, 'Node 3');
INSERT INTO NODE VALUES (next value for sq_node_id, 4, 'Node 4');
INSERT INTO NODE VALUES (next value for sq_node_id, 5, 'Node 5');

INSERT INTO EDGE VALUES (next value for sq_edge_id, 1, 3);
INSERT INTO EDGE VALUES (next value for sq_edge_id, 1, 2);
INSERT INTO EDGE VALUES (next value for sq_edge_id, 2, 4);
INSERT INTO EDGE VALUES (next value for sq_edge_id, 2, 5);
INSERT INTO EDGE VALUES (next value for sq_edge_id, 3, 3);
