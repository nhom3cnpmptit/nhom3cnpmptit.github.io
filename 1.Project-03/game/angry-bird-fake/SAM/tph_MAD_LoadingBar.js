function RenderLoadingBar_Standard(_graphics, _width,_height, _total, _current, _loadingscreen) 
{
		var barwidth = (_width / 100) * 50;				
		var barheight = 10;                             
		var x = (_width - barwidth) / 2;				
		var y = 10 + (_height - barheight) *0.75;			
		var w = (barwidth / _total) * _current;
		_graphics.fillStyle = "rgba(21,21,21,255)";
		_graphics.fillRect(0, 0, _width, _height);
		if (_current != 0)
		{
			_graphics.fillStyle = "rgba(64,64,64,255)";
			_graphics.fillRect(x, y, barwidth, barheight);
			_graphics.fillStyle = "rgba(141,143,144,255)";
			_graphics.fillRect(x, y, w, barheight);
		}

	if (_loadingscreen)
	{
		//draw splash.png image
		_graphics.drawImage(_loadingscreen, 350, 150, _width/3, _height/3);
	} 
}


