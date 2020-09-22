import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import './InfoBox.css';

function InfoBox({ title, cases, total}) {
  return (
    <Card className = "infoBox">
      <CardContent>
        {/* Title: Coronavirus case */}
        <Typography className="infoBox_title" color="textSecondary">{title}</Typography>
        
        <h2 className="infoBox_Cases"><strong>{cases}</strong></h2>
        
        <Typography className="infoBox_total" ><strong>{total} Total</strong></Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox 