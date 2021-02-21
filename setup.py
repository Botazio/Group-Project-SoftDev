from setuptools import setup

setup(name="systeminfo",
      version="0.1",
      description="COMP30830 Software Project,
      url="",
      author="Alvaro, Ellie, Mark",
      author_email="ellen.breen@ucdconnect.ie",
      licence="GPL3",
      packages=['systeminfo'],
      entry_points={
        'console_scripts':['sys_info_comp30830=systeminfo.main:main']
        }
      )
