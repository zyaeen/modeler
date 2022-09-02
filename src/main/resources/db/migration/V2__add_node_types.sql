CREATE TABLE NODE_TYPE
(
    id INTEGER NOT NULL UNIQUE ,
    label varchar2(50) NOT NULL UNIQUE
);
CREATE SEQUENCE sq_node_type_id START WITH 1 INCREMENT BY 1;



INSERT INTO NODE_TYPE VALUES (next value for sq_node_type_id, 'Anchor');
INSERT INTO NODE_TYPE VALUES (next value for sq_node_type_id, 'Tie');
INSERT INTO NODE_TYPE VALUES (next value for sq_node_type_id, 'Knot');
INSERT INTO NODE_TYPE VALUES (next value for sq_node_type_id, 'Attribute');

