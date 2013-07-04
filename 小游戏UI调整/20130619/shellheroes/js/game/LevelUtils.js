(function(LevelUtils){

	/**
	 * Get Nearest cell 
	 * @param cell object {i:<col>,j:<row>}
	 * @param nearId - If direction is right, then ids are 
	 * 8 1 2
	 * 7 0 3
	 * 6 5 4
	 * @param rtl - If direction is right to left
	 * @return Cell object{i:<col>,j:<row>} or null if no cell
	 */
	LevelUtils.init=function(levelInstance){
		this.levelInstance=levelInstance;
		this.exitCell={
			i:Config.levelData[Config.level-1].exit[0],
			j:Config.levelData[Config.level-1].exit[1]
		}
	}
	LevelUtils.getNearCell=function(cell,nearId,rtl){
		cell={i:cell.i,j:cell.j};
		rtl=(rtl==-1)?-1:1;
		if(nearId==0){
			return cell;
		}
		if(nearId!=1 && nearId!=5){
			if(rtl==1){
				if(nearId>5) cell.i-=1;
				if(nearId<5) cell.i+=1;
			}else{
				if(nearId>5) cell.i+=1;
				if(nearId<5) cell.i-=1;
			}
		}
		if(nearId==8 || nearId==1 || nearId==2){
			cell.j-=1;
		}
		if(nearId==6 || nearId==5 || nearId==4){
			cell.j+=1;
		}
		var levelData=Config.levelData[Config.level-1];
		if(levelData.data[cell.j]!=undefined){
			if(levelData.data[cell.j][cell.i]!=undefined){
				return cell;
			}
		}
		return null;
	}
	/**
	 * Get cell as a cell object from x and y co-ordinates
	 * @param x
	 * @param y
	 * @return Cell object{i:<col>,j:<row>}
	 */
	LevelUtils.getCell=function(x,y){
		var col=(x/Config.CELL_WIDTH)>>0;
		var row=(y/Config.CELL_HEIGHT)>>0;
		return {i:col,j:row};
	}
	
	/**
	 * Get cell content as object id.
	 * @param cell
	 * @return id String, empty if nothing found
	 */
	LevelUtils.getCellContent=function(cell){
		if(cell==null){
			return "empty";
		}
		var c=Config.boxes[Config.levelData[Config.level-1].data[cell.j][cell.i]];
		if(c){
			return c;
		}
		return "empty";
	}
	
	LevelUtils.getCellRect=function(cell){
		return new XNARectangle(cell.i*Config.CELL_WIDTH,cell.j*Config.CELL_HEIGHT,Config.CELL_WIDTH,Config.CELL_HEIGHT);
	}
	
	/**
	 * Get the object in the cell
	 * @param cell (i:<row>,j:<col>)
	 */
	LevelUtils.getObject=function(cell){
		if(cell==null || cell=="empty"){
			return "empty";
		}
		for(var i=0;i<this.levelInstance.levelBoxes.length;i++){
			var box=this.levelInstance.levelBoxes[i];
			if(cell.i==box.row && cell.j==box.col){
				return box;
			}
		}
		return "empty";
	}
	
	LevelUtils.isExitCell=function(cell){
		if(cell.i==this.exitCell.i && cell.j==this.exitCell.j){
			return true;
		}
		return false;
	}
	
	LevelUtils.isSameCell=function(cellA,cellB){
		if(!cellA || !cellB) return false;
		if(cellA.i===cellB.i && cellA.j===cellB.j){
			return true;
		}
		return false;
	}
	
	LevelUtils.isWalkable=function(box){
		if(!(box instanceof Box)){
			box=LevelUtils.getObject(box);
		}
		if(box=="empty"){
			return true;
		}
		if(box.isBlock){
			return false;
		}
		return true;
	}
	
	
	/**
	 * Checks whether if an action can be run
	 * @param currentBox - Current Box where character stands
	 * @param direction - Character direction
	 */
	LevelUtils.actionOK=function(currentBox,direction){
		var bottomCell=LevelUtils.getNearCell(currentBox.cell,5,direction);
		var backCell = LevelUtils.getNearCell(currentBox.cell,7,direction);
		var frontCell = LevelUtils.getNearCell(currentBox.cell,3,direction);
		var frontTopCell = LevelUtils.getNearCell(currentBox.cell,2,direction);
		var frontBottomCell=LevelUtils.getNearCell(currentBox.cell,4,direction);
		switch(currentBox.type){
			case "ladderActionBox":
				if(LevelUtils.isWalkable(backCell) && !LevelUtils.isWalkable(frontTopCell)){
					return true;
				}
			break;
			case "stepActionBox":
				if(!LevelUtils.isWalkable(bottomCell)){
					return true;
				}
			break;
			case "ropeActionBox":
				var b1=LevelUtils.getNearCell(frontBottomCell,5,direction);
				var b2=LevelUtils.getNearCell(b1,5,direction);
				if(!LevelUtils.isWalkable(bottomCell)&&LevelUtils.isWalkable(frontCell)&&LevelUtils.isWalkable(frontBottomCell)){
					if(LevelUtils.isWalkable(b1)&&LevelUtils.isWalkable(b2)){
						return true;
					}
				}
			break;
			case "halfBridgeActionBox":
				if(!LevelUtils.isWalkable(bottomCell) && LevelUtils.isWalkable(frontBottomCell)){
					return true;
				}
			break;
			case "bridgeActionBox":
				var b1= LevelUtils.getNearCell(frontBottomCell,3,direction);
				if(LevelUtils.isWalkable(b1) && !LevelUtils.isWalkable(bottomCell) && LevelUtils.isWalkable(frontBottomCell)){
					return true;
				}
			break;
			case "axeActionBox":
				return true;
			break;
			case "axeBox":
				var fo=LevelUtils.getObject(frontCell);
				if(fo!="empty" && fo.isSpike){
					return true;
				}
			break;
			case "jumpActionBox":
				var b1,b2,b3;
				b1=LevelUtils.getNearCell(frontTopCell,1,direction);
				b2=LevelUtils.getNearCell(b1,1,direction);
				b3=LevelUtils.getNearCell(b2,1,direction);
				if(!LevelUtils.isWalkable(frontCell)&& !LevelUtils.isWalkable(frontTopCell) && !LevelUtils.isWalkable(b1) && !LevelUtils.isWalkable(b2) && LevelUtils.isWalkable(b3)){
					return true;
				}
			break;
			case "bombActionBox":
				return true;
			break;
			case "bombBox":
				if(!LevelUtils.isWalkable(bottomCell)){
					return true;
				}
			break;
		}
		return false;
	}
	////////
	/**
	 * Character reached an action box, To do the action, call this..
	 * @param currentCell
	 * @param action
	 */
	LevelUtils.callAction=function(currentCell, action,direction){
		this.levelInstance.characterAction(LevelUtils.getObject(currentCell),action,direction);
	}
	
	
	window.LevelUtils=LevelUtils;
})(window.LevelUtils || {});
