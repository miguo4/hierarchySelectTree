import React, { Component } from 'react';
import { View } from '@tarojs/components'
import { AtIcon, AtListItem } from 'taro-ui'

import "./HierarchySelectTree.less"


export default class HierarchySelectTree extends Component {
    state = {
        personsTree: []
    }

    getCollapseData = (data, index, level) => {
        let tempData = data
        if (level === 1) {
            tempData[index].isCollapse = !tempData[index].isCollapse
        } else if (level === 2) {
            let indexs = index.split('-')
            tempData[indexs[0]].children[indexs[1]].isCollapse = !tempData[indexs[0]].children[indexs[1]].isCollapse
        }
        return tempData;
    }

    collapse = (item, index, level) => {
        if (!item.children || item.children.length === 0) return;
        let newTreeData = this.props.personsTree
        this.setState({
            personsTree: this.getCollapseData(newTreeData, index, level)
        })
    }

    computeSelectData = (data, indexList, level, index) => {
        console.log(data, indexList, level, index);

        if (level !== 1) {
            let currentId = indexList.shift()
            this.computeSelectData(data[currentId].children, indexList, --level, index)
            console.log('level !== 1', currentId);

        } else {
            console.log("indexList", indexList);

            data[indexList[0]].isSelected = !data[indexList[0]].isSelected //设置父节点的点击状态
            data[indexList[0]].hierarchy = index //记录层级信息，在删除操作中要使用此变量，更新选中的状态
            this.setChildren(data[indexList[0]], data[indexList[0]].isSelected, index) //子节点用父节点的点击状态
        }
    }
    setChildren = (data, state, index) => {
        if (data.children) {
            data.children = data.children.map((item, idx) => {
                this.setChildren(item, state, `${index}-${idx}`)
                return {
                    ...item,
                    isSelected: state,
                    hierarchy: `${index}-${idx}`,
                }
            })
        }
    }

    clickRadio = (index, level) => {
        let newTreeData = this.props.personsTree
        console.log("clickRadio", newTreeData);
        const indexList = index.split("-")
        this.computeSelectData(newTreeData, indexList, level, index)
        // this.setState({
        //     personsTree: newTreeData
        // })


        this.props.onselectedListener(newTreeData)
    }

    render() {
        const { personsTree } = this.props

        const Item = ({ item, index, level }) => {
            return <View style={{ marginLeft: level * 10, backgroundColor: level === 3 ? "#ECECEC" : "none" }}>
                <View className={level === 1 ? 'Item' : 'Item subItem'} >
                    <AtIcon value='check-circle' size="18" color={item.isSelected ? '#0A6DFD' : ''}
                        onClick={() => this.clickRadio(index, level)} />
                    <AtListItem title={level === 2 ? `${item.team}` : `${item.name}`} extraText={item.total ? `(${item.total}人)` : ''} arrow={item.total ? 'right' : ''} onClick={() => this.collapse(item, index + '', level)} />
                </View>
                {
                    item.children && item.isCollapse &&
                    item.children.map((childItem, childrenIndex) => {
                        return <Item item={childItem} index={`${index}-${childrenIndex}`} level={level + 1} />
                    })
                }
            </View>
        }

        return <View className='tree-box'>
            {
                personsTree.map((item, index) => {
                    return <Item item={item} index={`${index}`} level={1} />
                })
            }
        </View >
    }

}