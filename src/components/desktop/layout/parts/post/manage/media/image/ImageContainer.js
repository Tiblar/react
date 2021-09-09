// @flow

import React from "react";

import postStyles from "../../../../../../../../css/components/post.css";

import {useManageState} from "../../context";
import Image from "./Image";
import Row from "./Row";

const ImageContainer = (props) => {
    let { files } = useManageState();

    let lastRowNumber = 0;
    let rows = []

    files.forEach(file => {
        if(rows.length === 0){
            rows.push({
                id: 0,
                images: []
            });
        }

        if(file.row.row === lastRowNumber) {
            rows[rows.length - 1].images.push(file)
        }else{
            rows.push({
                id: file.row.row,
                images: [
                    file
                ]
            });

            lastRowNumber++;
        }
    });

    return (
        <div className={postStyles.rows}>
            {rows.map(row => {

                let minImage = row.images.reduce(function(res, obj) {
                    return ((obj.height/obj.width) < (res.height/res.width)) ? obj : res;
                });

                let minHeight = props.containerWidth !== null
                    ? (minImage.height / minImage.width) * (props.containerWidth/row.images.length)
                    : minImage.height;

                return (
                    <Row key={row.id} row={row}>
                        {row.images.map(file => (
                            <Image key={file.id}
                                   image={file}
                                   rowCount={row.images.length}
                                   height={minHeight} />
                        ))}
                    </Row>
                )
            })}
        </div>
    );
};

export default ImageContainer;
